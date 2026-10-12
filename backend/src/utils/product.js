// Whitelists and cleans a product body from the admin panel.

const CATEGORIES = ['daily', 'premium', 'dhoop', 'cup', 'puja', 'masala'];
const str = (v, max = 400) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const i18n = (v, max) => (v && typeof v === 'object' ? { mr: str(v.mr, max), en: str(v.en, max) } : undefined);
const num = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};
// Image paths are either bundled site images (/images/...) or admin uploads (/uploads/...).
const imagePath = (v) => {
  const s = str(v, 300);
  return /^\/(images|uploads)\/[\w\-./]+\.(jpe?g|png|webp|avif)$/i.test(s) && !s.includes('..') ? s : '';
};

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Returns { data, errors }. `partial` skips required checks (for updates). */
export function parseProduct(body = {}, { partial = false } = {}) {
  const errors = {};
  const data = {};
  const has = (k) => Object.prototype.hasOwnProperty.call(body, k);

  if (has('slug') || !partial) {
    data.slug = slugify(body.slug || body.name?.en);
    if (!data.slug) errors.slug = 'Slug is required (English letters, numbers and dashes)';
  }
  if (has('category') || !partial) {
    data.category = CATEGORIES.includes(body.category) ? body.category : '';
    if (!data.category) errors.category = 'Choose a category';
  }
  if (has('name') || !partial) {
    data.name = i18n(body.name, 120) || { mr: '', en: '' };
    if (!data.name.mr) errors.name = 'Marathi name is required';
  }
  if (has('image') || !partial) {
    data.image = imagePath(body.image);
    if (!data.image) errors.image = 'Add a product photo';
  }
  if (has('subtype')) data.subtype = str(body.subtype, 40);
  for (const k of ['tagline', 'packSize']) if (has(k)) data[k] = i18n(body[k], 160);
  for (const k of ['description', 'uses']) if (has(k)) data[k] = i18n(body[k], 2000);
  if (has('priceNote')) data.priceNote = body.priceNote ? i18n(body.priceNote, 160) : null;
  if (has('fragrance')) data.fragrance = str(body.fragrance, 40) || null;
  if (has('benefits')) data.benefits = Array.isArray(body.benefits) ? body.benefits.map((b) => str(b, 200)).filter(Boolean).slice(0, 12) : [];
  if (has('gallery')) data.gallery = Array.isArray(body.gallery) ? body.gallery.map(imagePath).filter(Boolean).slice(0, 12) : [];
  if (has('price')) data.price = num(body.price);
  if (has('mrp')) data.mrp = num(body.mrp);
  for (const k of ['featured', 'active', 'inStock']) if (has(k)) data[k] = Boolean(body[k]);
  if (has('sort')) data.sort = Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0;
  if (data.price != null && data.mrp != null && data.mrp < data.price) errors.mrp = 'MRP cannot be lower than the selling price';
  return { data, errors };
}
