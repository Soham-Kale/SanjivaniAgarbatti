import crypto from 'node:crypto';
import { config } from '../config.js';
import { adminFromToken } from '../utils/auth.js';

function keyMatches(given) {
  const expected = config.adminKey;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Guards admin routes. The admin panel sends `Authorization: Bearer <token>` from
 * POST /api/auth/login. The older `x-admin-key` header still works for scripts.
 */
export async function adminAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (token) {
      const admin = await adminFromToken(token);
      if (!admin) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
      req.admin = admin;
      return next();
    }
    if (keyMatches(req.get('x-admin-key') || '')) {
      req.admin = { email: 'api-key' };
      return next();
    }
    if (!config.jwtSecret && !config.adminKey) {
      return res.status(503).json({ error: 'JWT_SECRET is not configured on the server' });
    }
    res.status(401).json({ error: 'Unauthorized' });
  } catch (e) {
    next(e);
  }
}
