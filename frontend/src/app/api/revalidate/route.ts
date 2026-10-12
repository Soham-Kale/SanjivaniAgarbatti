import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { API_URL } from '@/lib/api-url';

/**
 * Called by the admin panel after a save. The admin's token is checked against the API, then
 * every page is marked stale so the next visit shows the new prices and content.
 */
export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (!API_URL || !auth.startsWith('Bearer ')) return NextResponse.json({ ok: false }, { status: 401 });
  const me = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: auth }, cache: 'no-store' }).catch(() => null);
  if (!me?.ok) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag('products');
  revalidateTag('content');
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
