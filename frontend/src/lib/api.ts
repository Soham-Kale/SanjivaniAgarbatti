import localProducts from '@/data/products.json';
import type { EnquiryType, Product } from './types';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const FALLBACK = localProducts as Product[];

/**
 * Products come from the Express API when it is reachable, otherwise from the bundled
 * list (src/data/products.json) so the site never shows an empty catalogue.
 */
export async function getProducts(): Promise<Product[]> {
  if (!API_URL) return FALLBACK;
  try {
    const res = await fetch(`${API_URL}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { items: Product[] };
    return data.items.length ? data.items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
      if (res.ok) return ((await res.json()) as { item: Product }).item;
    } catch {
      /* fall through to local data */
    }
  }
  return FALLBACK.find((p) => p.slug === slug);
}

export function getLocalProducts() {
  return FALLBACK;
}

export type SubmitResult = { ok: true } | { ok: false; fields?: Record<string, string>; offline?: boolean };

export async function submitEnquiry(type: EnquiryType, body: Record<string, string>): Promise<SubmitResult> {
  if (!API_URL) return { ok: false, offline: true };
  try {
    const res = await fetch(`${API_URL}/api/enquiries/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, fields: data.fields };
  } catch {
    return { ok: false, offline: true };
  }
}
