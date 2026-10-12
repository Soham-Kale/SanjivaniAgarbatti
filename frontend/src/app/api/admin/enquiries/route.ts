import { requireAdmin } from '@/server/auth';
import { json, plain, route } from '@/server/http';
import { ENQUIRY_STATUS, ENQUIRY_TYPES, Enquiry } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/enquiries?type=franchise&status=new&page=1&limit=50
export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const p = new URL(req.url).searchParams;
  const q: Record<string, string> = {};
  const type = p.get('type') || '';
  const status = p.get('status') || '';
  if ((ENQUIRY_TYPES as readonly string[]).includes(type)) q.type = type;
  if ((ENQUIRY_STATUS as readonly string[]).includes(status)) q.status = status;
  const limit = Math.min(Number(p.get('limit')) || 50, 200);
  const page = Math.max(Number(p.get('page')) || 1, 1);
  const [items, total] = await Promise.all([
    Enquiry.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(q),
  ]);
  return json({ items: plain(items), total, page, limit });
});
