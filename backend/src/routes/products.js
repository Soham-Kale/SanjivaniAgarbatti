import { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// GET /api/products?category=dhoop&fragrance=chandan&featured=true
router.get('/', async (req, res, next) => {
  try {
    const q = { active: true };
    if (req.query.category) q.category = String(req.query.category);
    if (req.query.fragrance) q.fragrance = String(req.query.fragrance);
    if (req.query.featured === 'true') q.featured = true;
    const items = await Product.find(q).sort({ sort: 1 }).lean();
    res.json({ items, count: items.length });
  } catch (e) {
    next(e);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const item = await Product.findOne({ slug: req.params.slug, active: true }).lean();
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

export default router;
