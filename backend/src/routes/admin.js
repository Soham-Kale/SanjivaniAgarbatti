import { Router } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { config } from '../config.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { Enquiry, ENQUIRY_STATUS, ENQUIRY_TYPES } from '../models/Enquiry.js';
import { Product } from '../models/Product.js';
import { Content } from '../models/Content.js';
import { parseProduct } from '../utils/product.js';

const router = Router();
router.use(adminAuth);

/* ---------- dashboard ---------- */

router.get('/stats', async (req, res, next) => {
  try {
    const [products, hidden, priced, newEnquiries, byType, recent] = await Promise.all([
      Product.countDocuments({ active: true }),
      Product.countDocuments({ active: false }),
      Product.countDocuments({ active: true, price: { $ne: null } }),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);
    res.json({ products, hidden, priced, newEnquiries, byType: Object.fromEntries(byType.map((b) => [b._id, b.count])), recent });
  } catch (e) {
    next(e);
  }
});

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

router.delete('/enquiries/:id', async (req, res, next) => {
  try {
    const item = await Enquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ ok: true });
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

router.get('/products/:slug', async (req, res, next) => {
  try {
    const item = await Product.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const { data, errors } = parseProduct(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', fields: errors });
    if (await Product.exists({ slug: data.slug })) return res.status(409).json({ error: 'Validation failed', fields: { slug: 'This slug is already used' } });
    if (req.body.sort === undefined) data.sort = ((await Product.findOne().sort({ sort: -1 }).lean())?.sort || 0) + 1;
    res.status(201).json({ item: await Product.create(data) });
  } catch (e) {
    next(e);
  }
});

router.put('/products/:slug', async (req, res, next) => {
  try {
    const { data, errors } = parseProduct(req.body, { partial: true });
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', fields: errors });
    if (data.slug && data.slug !== req.params.slug && (await Product.exists({ slug: data.slug }))) {
      return res.status(409).json({ error: 'Validation failed', fields: { slug: 'This slug is already used' } });
    }
    const item = await Product.findOneAndUpdate({ slug: req.params.slug }, data, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/products/:slug          -> hides it from the website (can be restored)
// DELETE /api/admin/products/:slug?permanent=true -> removes it from the database
router.delete('/products/:slug', async (req, res, next) => {
  try {
    const permanent = req.query.permanent === 'true';
    const item = permanent
      ? await Product.findOneAndDelete({ slug: req.params.slug })
      : await Product.findOneAndUpdate({ slug: req.params.slug }, { active: false }, { new: true });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true, permanent });
  } catch (e) {
    next(e);
  }
});

/* ---------- site content ---------- */

router.get('/content', async (req, res, next) => {
  try {
    const doc = await Content.findOne({ key: 'site' }).lean();
    res.json({ data: doc?.data || {}, updatedAt: doc?.updatedAt || null });
  } catch (e) {
    next(e);
  }
});

// PUT /api/admin/content { data } : replaces the stored content overrides
router.put('/content', async (req, res, next) => {
  try {
    const data = req.body?.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'data must be an object' });
    const doc = await Content.findOneAndUpdate(
      { key: 'site' },
      { data, updatedBy: req.admin.email },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ data: doc.data, updatedAt: doc.updatedAt });
  } catch (e) {
    next(e);
  }
});

/* ---------- image uploads ---------- */

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' };
fs.mkdirSync(config.uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXT[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => cb(null, Boolean(EXT[file.mimetype])),
});

// POST /api/admin/uploads (multipart, field "files") -> { urls: ['/uploads/...'] }
router.post('/uploads', upload.array('files', 10), (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: 'Upload JPG, PNG, WebP or AVIF images up to 5 MB' });
  res.status(201).json({ urls: files.map((f) => `/uploads/${path.basename(f.filename)}`) });
});

export default router;
