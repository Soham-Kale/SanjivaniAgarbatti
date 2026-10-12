import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from './env';
import { fail } from './http';
import { Admin, hashPassword, type AdminDoc } from './models';

/** A signed-in admin, or the script key (no account behind it). */
export type AdminUser = { doc: AdminDoc; email: string } | { doc: null; email: 'api-key' };

export function signToken(admin: AdminDoc) {
  return jwt.sign({ sub: String(admin._id), v: admin.tokenVersion }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

async function adminFromToken(token: string) {
  if (!token || !env.jwtSecret) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; v: number };
    const admin = await Admin.findById(payload.sub);
    if (!admin || admin.tokenVersion !== payload.v) return null;
    return admin;
  } catch {
    return null;
  }
}

function keyMatches(given: string) {
  if (!env.adminKey || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(env.adminKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Checks `Authorization: Bearer <token>` (from the admin panel) or `x-admin-key` (scripts).
 * Returns the admin, or a ready 401/503 response to send back.
 */
export async function requireAdmin(req: Request): Promise<AdminUser | Response> {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token) {
    const admin = await adminFromToken(token);
    return admin ? { doc: admin, email: admin.email } : fail(401, 'Session expired. Please sign in again.');
  }
  if (keyMatches(req.headers.get('x-admin-key') || '')) return { doc: null, email: 'api-key' };
  if (!env.jwtSecret && !env.adminKey) return fail(503, 'JWT_SECRET is not configured on the server');
  return fail(401, 'Unauthorized');
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists yet. */
export async function ensureFirstAdmin() {
  if (!env.adminEmail || !env.adminPassword) return;
  if (await Admin.estimatedDocumentCount()) return;
  await Admin.create({ email: env.adminEmail, passwordHash: await hashPassword(env.adminPassword) });
  console.log(`Created first admin account: ${env.adminEmail}`);
}
