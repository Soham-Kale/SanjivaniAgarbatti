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

export const apiConfigured = () => Boolean(API_URL);

export async function adminFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new ApiError('Backend URL missing: add NEXT_PUBLIC_API_URL=http://localhost:5000 to frontend/.env.local and restart npm run dev', 0);
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' });
  } catch {
    throw new ApiError(`Cannot reach the backend at ${API_URL}. Start it with "npm run dev" in the backend folder.`, 0);
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

export async function uploadImages(files: FileList | File[]): Promise<string[]> {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append('files', f));
  const { urls } = await adminFetch<{ urls: string[] }>('/api/admin/uploads', { method: 'POST', body: fd });
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
