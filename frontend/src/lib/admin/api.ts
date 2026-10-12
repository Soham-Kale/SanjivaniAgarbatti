'use client';

import { API_URL } from '@/lib/api-url';

/**
 * Browser-side client for the admin API. The sign-in token is kept in sessionStorage, so it is
 * forgotten when the browser tab is closed, and it expires on the server after JWT_EXPIRES_IN.
 */
const KEY = 'sanjivani-admin-token';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}

export const getToken = () => {
  try {
    return sessionStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
};
export const setToken = (t: string) => {
  try {
    if (t) sessionStorage.setItem(KEY, t);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
};

export async function adminFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' });
  } catch {
    throw new ApiError('Cannot reach the server. Check your internet connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken('');
      if (!location.pathname.startsWith('/admin/login')) location.href = '/admin/login?expired=1';
    }
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data.fields);
  }
  return data as T;
}

export async function login(email: string, password: string) {
  const data = await adminFetch<{ token: string; admin: { email: string; name: string } }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.admin;
}

export function logout() {
  setToken('');
  location.href = '/admin/login';
}

const MAX_UPLOAD = 5 * 1024 * 1024;
const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

type UploadSignature = { cloudName: string; apiKey: string; timestamp: number; folder: string; allowedFormats: string; signature: string };

/**
 * Uploads photos straight from the browser to Cloudinary (signed by /api/admin/uploads/sign)
 * and returns their https URLs.
 */
export async function uploadImages(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files).slice(0, 10);
  const bad = list.find((f) => !UPLOAD_TYPES.includes(f.type) || f.size > MAX_UPLOAD);
  if (bad) throw new ApiError(`${bad.name}: upload JPG, PNG, WebP or AVIF images up to 5 MB`, 400);
  const sig = await adminFetch<UploadSignature>('/api/admin/uploads/sign', { method: 'POST' });
  const urls: string[] = [];
  for (const file of list) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sig.apiKey);
    fd.append('timestamp', String(sig.timestamp));
    fd.append('folder', sig.folder);
    fd.append('allowed_formats', sig.allowedFormats);
    fd.append('signature', sig.signature);
    let res: Response;
    try {
      res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: fd });
    } catch {
      throw new ApiError('Cannot reach Cloudinary. Check your internet connection and try again.', 0);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.secure_url) throw new ApiError(data.error?.message || `Upload failed (${res.status})`, res.status);
    urls.push(data.secure_url);
  }
  return urls;
}

/** Asks Next.js to rebuild cached pages so changes show on the website straight away. */
export async function refreshSite() {
  try {
    await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } });
  } catch {
    /* pages still refresh on their own within a minute */
  }
}
