import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';
import { ENQUIRY_TYPES, Enquiry } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLS = ['createdAt', 'type', 'status', 'name', 'mobile', 'city', 'plan', 'hasShop', 'investment', 'shopName', 'businessType', 'products', 'items', 'message', 'notes'];
// Visitors type these fields, so a value starting with = + - @ is prefixed with ' to stop Excel running it as a formula.
const esc = (v: unknown) => {
  const s = String(v ?? '');
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

// GET /api/admin/enquiries.csv?type=franchise
export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const type = new URL(req.url).searchParams.get('type') || '';
  const q = (ENQUIRY_TYPES as readonly string[]).includes(type) ? { type } : {};
  const rows = (await Enquiry.find(q).sort({ createdAt: -1 }).lean()) as unknown as Record<string, unknown>[];
  const cell = (r: Record<string, unknown>, c: string) =>
    c === 'createdAt'
      ? (r.createdAt as Date | undefined)?.toISOString()
      : c === 'items'
        ? ((r.items as { name?: string; slug: string; qty: number }[]) || []).map((i) => `${i.name || i.slug} x${i.qty}`).join('; ')
        : r[c];
  const csv = [COLS.join(','), ...rows.map((r) => COLS.map((c) => esc(cell(r, c))).join(','))].join('\n');
  // BOM so Excel shows Marathi correctly
  return new Response('﻿' + csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="sanjivani-enquiries.csv"' },
  });
});
