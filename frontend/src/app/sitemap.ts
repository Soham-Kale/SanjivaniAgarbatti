import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

// Rebuilt at most once an hour, so products added in the admin panel are listed too.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/franchise`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
  const products = (await getProducts()) as (Awaited<ReturnType<typeof getProducts>>[number] & { updatedAt?: string })[];
  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: [p.image].map((i) => (i.startsWith('http') ? i : `${SITE_URL}${i}`)),
    })),
  ];
}
