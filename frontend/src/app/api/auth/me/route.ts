import { requireAdmin } from '@/server/auth';
import { json, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/auth/me -> { admin }
export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  return json({ admin: me.doc ? { id: me.doc._id, email: me.doc.email, name: me.doc.name } : { email: me.email } });
});
