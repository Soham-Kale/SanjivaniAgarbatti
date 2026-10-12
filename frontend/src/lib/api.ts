// Server only: imported by server components (it reads MongoDB).
import { unstable_cache } from 'next/cache';
import localProducts from '@/data/products.json';
import { findProduct, listProducts, readContent } from '@/server/data';
import { dbConfigured } from '@/server/env';
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from './content';
import type { Product } from './types';

/*
 * Data for the server-rendered pages, read straight from MongoDB. Results are cached for a
 * minute, and the admin panel clears the cache on every save. Without MONGODB_URI (or if the
 * database is down) the site uses the bundled list (src/data/products.json) and the built-in
 * texts, so it never shows an empty catalogue.
 */
const FALLBACK = localProducts as Product[];
const cache = { revalidate: 60 };

const cachedProducts = unstable_cache(async () => (await listProducts()) as unknown as Product[], ['products'], { ...cache, tags: ['products'] });
const cachedProduct = unstable_cache(async (slug: string) => (await findProduct(slug)) as unknown as Product | null, ['product'], { ...cache, tags: ['products'] });
const cachedContent = unstable_cache(async () => (await readContent()).data, ['content'], { ...cache, tags: ['content'] });

export async function getProducts(): Promise<Product[]> {
  if (!dbConfigured()) return FALLBACK;
  try {
    const items = await cachedProducts();
    return items.length ? items : FALLBACK;
  } catch (e) {
    console.error('Products: using the bundled list', e);
    return FALLBACK;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (dbConfigured()) {
    try {
      // Hidden or deleted in the admin panel: do not fall back to the bundled copy.
      return (await cachedProduct(slug)) ?? undefined;
    } catch (e) {
      console.error('Product: using the bundled list', e);
    }
  }
  return FALLBACK.find((p) => p.slug === slug);
}

/** Admin-edited site content merged over the built-in defaults. */
export async function getContent(): Promise<SiteContent> {
  if (!dbConfigured()) return DEFAULT_CONTENT;
  try {
    return mergeContent(DEFAULT_CONTENT, await cachedContent());
  } catch (e) {
    console.error('Content: using the built-in texts', e);
    return DEFAULT_CONTENT;
  }
}

export function getLocalProducts() {
  return FALLBACK;
}
