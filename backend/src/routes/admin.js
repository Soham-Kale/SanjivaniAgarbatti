import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { Enquiry, ENQUIRY_STATUS, ENQUIRY_TYPES } from '../models/Enquiry.js';
import { Product } from '../models/Product.js';

const router = Router();
router.use(adminAuth);

/* ---------- enquiries ---------- */

// GET /api/admin/enquiries?type=franchise&status=new&page=1&limit=50
router.get('/enquiries', async (req, res, next) => {
  try {
    const q = {};
    if (ENQUIRY_TYPES.includes(req.query.type)) q.type = req.query.type;
    if (ENQUIRY_STATUS.includes(req.query.status)) q.status = req.query.status;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const [items, total] = await Promise.all([
      Enquiry.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Enquiry.countDocuments(q),
    ]);
    res.json({ items, total, page, limit });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/enquiries/:id  { status, notes }
router.patch('/enquiries/:id', async (req, res, next) => {
  try {
    const update = {};
    if (ENQUIRY_STATUS.includes(req.body.status)) update.status = req.body.status;
    if (typeof req.body.notes === 'string') update.notes = req.body.notes.slice(0, 2000);
    const item = await Enquiry.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/enquiries.csv?type=franchise
router.get('/enquiries.csv', async (req, res, next) => {
  try {
    const q = ENQUIRY_TYPES.includes(req.query.type) ? { type: req.query.type } : {};
    const rows = await Enquiry.find(q).sort({ createdAt: -1 }).lean();
    const cols = ['createdAt', 'type', 'status', 'name', 'mobile', 'city', 'plan', 'hasShop', 'investment', 'shopName', 'businessType', 'products', 'items', 'message', 'notes'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(c === 'createdAt' ? r[c]?.toISOString() : c === 'items' ? (r.items || []).map((i) => `${i.name || i.slug} x${i.qty}`).join('; ') : r[c])).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="sanjivani-enquiries.csv"');
    res.send('﻿' + csv); // BOM so Excel shows Marathi correctly
  } catch (e) {
    next(e);
  }
});

/* ---------- products ---------- */

router.get('/products', async (req, res, next) => {
  try {
    res.json({ items: await Product.find().sort({ sort: 1 }).lean() });
  } catch (e) {
    next(e);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    res.status(201).json({ item: await Product.create(req.body) });
  } catch (e) {
    next(e);
  }
});

router.put('/products/:slug', async (req, res, next) => {
  try {
    const item = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

router.delete('/products/:slug', async (req, res, next) => {
  try {
    // Soft delete so old links and enquiries keep working.
    const item = await Product.findOneAndUpdate({ slug: req.params.slug }, { active: false }, { new: true });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
