import { requireAdmin, signToken } from '@/server/auth';
import { body, fail, json, route } from '@/server/http';
import { MIN_PASSWORD, checkPassword, hashPassword } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/auth/password { currentPassword, newPassword } -> { token }
export const POST = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  if (!me.doc) return fail(400, 'Sign in with email and password to change it');
  const { currentPassword, newPassword } = await body(req);
  if (!(await checkPassword(currentPassword, me.doc.passwordHash))) return fail(400, 'Current password is wrong');
  if (String(newPassword || '').length < MIN_PASSWORD) return fail(400, `New password must be at least ${MIN_PASSWORD} characters`);
  me.doc.passwordHash = await hashPassword(String(newPassword));
  me.doc.tokenVersion += 1; // signs out other sessions
  await me.doc.save();
  return json({ token: signToken(me.doc) });
});
