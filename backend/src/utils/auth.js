import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { Admin } from '../models/Admin.js';

export function signToken(admin) {
  return jwt.sign({ sub: String(admin._id), v: admin.tokenVersion }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/** Returns the admin for a valid, current token, or null. */
export async function adminFromToken(token) {
  if (!token || !config.jwtSecret) return null;
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    if (!admin || admin.tokenVersion !== payload.v) return null;
    return admin;
  } catch {
    return null;
  }
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists yet. */
export async function ensureFirstAdmin() {
  if (!config.adminEmail || !config.adminPassword) return;
  if (await Admin.estimatedDocumentCount()) return;
  await Admin.create({ email: config.adminEmail, passwordHash: await Admin.hashPassword(config.adminPassword) });
  console.log(`Created first admin account: ${config.adminEmail}`);
}
