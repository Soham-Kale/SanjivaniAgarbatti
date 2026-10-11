import crypto from 'node:crypto';
import { config } from '../config.js';

// Simple shared-secret guard for admin routes. Replace with real auth (JWT/sessions) before
// giving the admin panel to more than one person.
export function adminAuth(req, res, next) {
  const given = req.get('x-admin-key') || '';
  const expected = config.adminKey;
  if (!expected) return res.status(503).json({ error: 'ADMIN_KEY is not configured on the server' });
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
