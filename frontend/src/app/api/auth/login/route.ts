import { ensureFirstAdmin, signToken } from '@/server/auth';
import { env } from '@/server/env';
import { body, clientIp, fail, json, rateLimiter, route } from '@/server/http';
import { Admin, checkPassword } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 10 sign-in attempts per visitor per 15 minutes.
const allow = rateLimiter(10, 15 * 60 * 1000);

// POST /api/auth/login { email, password } -> { token, admin }
export const POST = route(async (req: Request) => {
  if (!env.jwtSecret) return fail(503, 'JWT_SECRET is not configured on the server');
  if (!allow(clientIp(req))) return fail(429, 'Too many sign-in attempts. Try again in 15 minutes.');
  await ensureFirstAdmin();
  const b = await body(req);
  const email = String(b.email || '').trim().toLowerCase();
  const admin = email ? await Admin.findOne({ email }) : null;
  if (!admin || !(await checkPassword(b.password, admin.passwordHash))) return fail(401, 'Wrong email or password');
  admin.lastLoginAt = new Date();
  await admin.save();
  return json({ token: signToken(admin), admin: { id: admin._id, email: admin.email, name: admin.name } });
});
