import { API_URL } from './api-url';
import type { EnquiryType } from './types';

export type SubmitResult = { ok: true } | { ok: false; fields?: Record<string, string>; offline?: boolean };

/** Sends a form from the browser to /api/enquiries/<type>. "offline" means: show the WhatsApp/call fallback. */
export async function submitEnquiry(type: EnquiryType, body: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API_URL}/api/enquiries/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    if (res.status === 400 && data.fields) return { ok: false, fields: data.fields };
    return { ok: false, offline: true };
  } catch {
    return { ok: false, offline: true };
  }
}
