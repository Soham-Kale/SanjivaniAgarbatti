import { Router } from 'express';
import { Content } from '../models/Content.js';

const router = Router();

// GET /api/content -> { data } : the admin-edited site content (may be empty)
router.get('/', async (req, res, next) => {
  try {
    const doc = await Content.findOne({ key: 'site' }).lean();
    res.json({ data: doc?.data || {}, updatedAt: doc?.updatedAt || null });
  } catch (e) {
    next(e);
  }
});

export default router;
