import { requireAdmin } from '@/server/auth';
import { body, fail, json, route } from '@/server/http';
import { ENQUIRY_STATUS, Enquiry } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

// PATCH /api/admin/enquiries/:id  { status, notes }
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const b = await body(req);
  const update: Record<string, string> = {};
  if ((ENQUIRY_STATUS as readonly string[]).includes(b.status as string)) update.status = b.status as string;
  if (typeof b.notes === 'string') update.notes = b.notes.slice(0, 2000);
  const item = await Enquiry.findByIdAndUpdate(params.id, update, { new: true, runValidators: true });
  return item ? json({ item }) : fail(404, 'Enquiry not found');
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const item = await Enquiry.findByIdAndDelete(params.id);
  return item ? json({ ok: true }) : fail(404, 'Enquiry not found');
});
