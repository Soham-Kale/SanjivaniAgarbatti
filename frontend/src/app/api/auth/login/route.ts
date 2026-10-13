import { ensureFirstAdmin, signToken } from '@/server/auth';
import { env } from '@/server/env';
import { body, clientIp, fail, json, rateLimiter, route } from '@/server/http';
import { Admin, checkPassword } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 10 sign-in attempts per visitor per 15 minutes.
const allow = rateLimiter(10, 15 * 60 * 1000);
// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
const DUMMY_HASH = '$2b$12$UNhsU43akokn1VZ0B1x3I.pxusJzf85GgCeY6Gnm9nr2zbJ/kC/Zm';

// POST /api/auth/login { email, password } -> { token, admin }
export const POST = route(async (req: Request) => {
  if (!env.jwtSecret) return fail(503, 'JWT_SECRET is not configured on the server');
  if (env.jwtSecret.length < 32) return fail(503, 'JWT_SECRET is too short: use at least 32 random characters');
  if (!allow(clientIp(req))) return fail(429, 'Too many sign-in attempts. Try again in 15 minutes.');
  await ensureFirstAdmin();
  const b = await body(req);
  const email = String(b.email || '').trim().toLowerCase();
  const admin = email ? await Admin.findOne({ email }) : null;
  const ok = await checkPassword(b.password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !ok) return fail(401, 'Wrong email or password');
  admin.lastLoginAt = new Date();
  await admin.save();
  return json({ token: signToken(admin), admin: { id: admin._id, email: admin.email, name: admin.name } });
});
