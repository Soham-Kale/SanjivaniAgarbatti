import { requireAdmin } from '@/server/auth';
import { json, refreshPages, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Called by the admin panel after a save: every page is marked stale so the next visit shows the change. */
export const POST = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  refreshPages();
  return json({ ok: true });
});
