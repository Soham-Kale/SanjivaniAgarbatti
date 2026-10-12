import localProducts from '@/data/products.json';
import { connectDB } from './db';
import { plain } from './http';
import { Content, Product } from './models';

/* Database reads shared by the public API routes and the server-rendered pages. */

export async function listProducts(filter: { category?: string; fragrance?: string; featured?: boolean } = {}) {
  await ensureSeeded();
  const q: Record<string, unknown> = { active: true };
  if (filter.category) q.category = filter.category;
  if (filter.fragrance) q.fragrance = filter.fragrance;
  if (filter.featured) q.featured = true;
  return plain<Record<string, unknown>[]>(await Product.find(q).sort({ sort: 1 }).lean());
}

export async function findProduct(slug: string) {
  await ensureSeeded();
  const item = await Product.findOne({ slug, active: true }).lean();
  return item ? plain<Record<string, unknown>>(item) : null;
}

export async function readContent() {
  await connectDB();
  const doc = await Content.findOne({ key: 'site' }).lean();
  return { data: (doc?.data as Record<string, unknown>) || {}, updatedAt: doc?.updatedAt || null };
}

/**
 * First run against an empty database: copies the bundled catalogue (src/data/products.json)
 * in, so the site and the admin panel start with the real product list. Never touches
 * existing products, and checks only once per server instance.
 */
const g = globalThis as unknown as { _seeded?: boolean };
export async function ensureSeeded() {
  if (g._seeded) return;
  await connectDB();
  if (!(await Product.estimatedDocumentCount())) {
    const ops = (localProducts as Record<string, unknown>[]).map((p) => ({
      updateOne: { filter: { slug: p.slug }, update: { $setOnInsert: p }, upsert: true },
    }));
    await Product.bulkWrite(ops);
    console.log(`Added ${ops.length} products from src/data/products.json`);
  }
  g._seeded = true;
}
