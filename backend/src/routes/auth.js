import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { Admin, MIN_PASSWORD } from '../models/Admin.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { signToken } from '../utils/auth.js';

const router = Router();

// 10 sign-in attempts per IP per 15 minutes.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });

const publicAdmin = (a) => ({ id: a._id, email: a.email, name: a.name });

// POST /api/auth/login { email, password } -> { token, admin }
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    if (!config.jwtSecret) return res.status(503).json({ error: 'JWT_SECRET is not configured on the server' });
    const email = String(req.body?.email || '').trim().toLowerCase();
    const admin = email ? await Admin.findOne({ email }) : null;
    if (!admin || !(await admin.checkPassword(req.body?.password))) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }
    admin.lastLoginAt = new Date();
    await admin.save();
    res.json({ token: signToken(admin), admin: publicAdmin(admin) });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/me -> { admin }
router.get('/me', adminAuth, (req, res) => {
  res.json({ admin: req.admin._id ? publicAdmin(req.admin) : { email: req.admin.email } });
});

// POST /api/auth/password { currentPassword, newPassword } -> { token }
router.post('/password', adminAuth, async (req, res, next) => {
  try {
    if (!req.admin._id) return res.status(400).json({ error: 'Sign in with email and password to change it' });
    const { currentPassword, newPassword } = req.body || {};
    if (!(await req.admin.checkPassword(currentPassword))) return res.status(400).json({ error: 'Current password is wrong' });
    if (String(newPassword || '').length < MIN_PASSWORD) {
      return res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD} characters` });
    }
    req.admin.passwordHash = await Admin.hashPassword(newPassword);
    req.admin.tokenVersion += 1; // signs out other sessions
    await req.admin.save();
    res.json({ token: signToken(req.admin) });
  } catch (e) {
    next(e);
  }
});

export default router;
