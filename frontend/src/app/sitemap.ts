import type { MetadataRoute } from 'next';
import { getLocalProducts } from '@/lib/api';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pages = ['', '/products', '/franchise', '/about', '/contact'].map((p) => ({ url: `${base}${p}` }));
  return [...pages, ...getLocalProducts().map((p) => ({ url: `${base}/products/${p.slug}` }))];
}
