import { requireAdmin } from '@/server/auth';
import { readContent } from '@/server/data';
import { body, fail, json, refreshPages, route } from '@/server/http';
import { Content } from '@/server/models';
import { sanitizeContent } from '@/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  return json(await readContent());
});

// PUT /api/admin/content { data }: replaces the stored content overrides
export const PUT = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  if (Number(req.headers.get('content-length') || 0) > 512 * 1024) return fail(413, 'Content is too large');
  const raw = (await body(req)).data;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fail(400, 'data must be an object');
  const data = sanitizeContent(raw);
  const doc = await Content.findOneAndUpdate({ key: 'site' }, { data, updatedBy: me.email }, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
  refreshPages();
  return json({ data: doc?.data, updatedAt: doc?.updatedAt });
});
