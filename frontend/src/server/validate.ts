import { env } from './env';
import type { EnquiryKind } from './models';

/* Whitelists and cleans request bodies. Ported from the old Express backend. */

type Body = Record<string, unknown>;
type Errors = Record<string, string>;

const clean = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function normaliseMobile(v: unknown) {
  const digits = String(v || '').replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

const PLANS = ['mini', 'franchise', 'warehouse'];

/** Returns { data, errors } for a public enquiry body. Only whitelisted fields are kept. */
export function parseEnquiry(type: EnquiryKind, body: Body = {}) {
  const errors: Errors = {};
  const data: Record<string, unknown> & { name: string; mobile: string; city: string } = {
    type,
    name: clean(body.name, 120),
    mobile: normaliseMobile(body.mobile),
    city: clean(body.city, 120),
    message: clean(body.message, 2000),
  };
  if (data.name.length < 2) errors.name = 'नाव आवश्यक आहे';
  if (!/^[6-9]\d{9}$/.test(data.mobile)) errors.mobile = 'वैध १० अंकी मोबाईल नंबर टाका';

  if (type === 'franchise') {
    data.plan = PLANS.includes(body.plan as string) ? body.plan : '';
    data.hasShop = clean(body.hasShop, 60);
    data.investment = clean(body.investment, 60);
    if (!data.plan) errors.plan = 'प्लॅन निवडा';
    if (!data.city) errors.city = 'गाव / जिल्हा आवश्यक आहे';
  }
  if (type === 'dealer') {
    data.shopName = clean(body.shopName, 160);
    data.businessType = clean(body.businessType, 60);
    data.products = clean(body.products, 300);
    if (!data.city) errors.city = 'गाव / जिल्हा आवश्यक आहे';
  }
  if (type === 'order') {
    const items = Array.isArray(body.items) ? (body.items as Body[]).slice(0, 50) : [];
    data.items = items
      .map((it) => ({
        slug: clean(it?.slug, 80),
        name: clean(it?.name, 160),
        qty: Math.min(Math.max(Math.floor(Number(it?.qty) || 0), 0), 999),
      }))
      .filter((it) => it.slug && it.qty > 0);
    if (!(data.items as unknown[]).length) errors.items = 'ऑर्डर यादी रिकामी आहे';
  }
  return { data, errors };
}

const CATEGORIES = ['daily', 'premium', 'dhoop', 'cup', 'puja', 'masala'];
const str = (v: unknown, max = 400) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const i18n = (v: unknown, max: number) => (v && typeof v === 'object' ? { mr: str((v as Body).mr, max), en: str((v as Body).en, max) } : undefined);
const num = (v: unknown) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Images are bundled site images (/images/...), old uploads from the Express backend
 * (/uploads/...) or photos uploaded to this site's Cloudinary account.
 */
export function imagePath(v: unknown) {
  const s = str(v, 400);
  if (s.includes('..')) return '';
  if (/^\/(images|uploads)\/[\w\-./]+\.(jpe?g|png|webp|avif)$/i.test(s)) return s;
  const cloud = env.cloudinary.cloudName;
  if (cloud && new RegExp(`^https://res\\.cloudinary\\.com/${esc(cloud)}/image/upload/[\\w\\-./,]+\\.(jpe?g|png|webp|avif)$`, 'i').test(s)) return s;
  return '';
}

export function slugify(s: unknown) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Returns { data, errors }. `partial` skips required checks (for updates). */
export function parseProduct(body: Body = {}, { partial = false } = {}) {
  const errors: Errors = {};
  const data: Record<string, unknown> = {};
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);

  if (has('slug') || !partial) {
    data.slug = slugify(body.slug || (body.name as Body | undefined)?.en);
    if (!data.slug) errors.slug = 'Slug is required (English letters, numbers and dashes)';
  }
  if (has('category') || !partial) {
    data.category = CATEGORIES.includes(body.category as string) ? body.category : '';
    if (!data.category) errors.category = 'Choose a category';
  }
  if (has('name') || !partial) {
    const name = i18n(body.name, 120) || { mr: '', en: '' };
    data.name = name;
    if (!name.mr) errors.name = 'Marathi name is required';
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
  if (data.price != null && data.mrp != null && (data.mrp as number) < (data.price as number)) errors.mrp = 'MRP cannot be lower than the selling price';
  return { data, errors };
}
