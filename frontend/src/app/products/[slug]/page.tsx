import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getLocalProducts, getProduct, getProducts } from '@/lib/api';
import { breadcrumbJsonLd, ldJson, pageMeta, productJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return getLocalProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'पान सापडले नाही', robots: { index: false } };
  return pageMeta({
    title: `${p.name.mr} · ${p.name.en}`,
    description: `${p.description.mr} ${p.name.en} by Sanjivani Agarbatti, Akluj.`.slice(0, 300),
    path: `/products/${p.slug}`,
    image: p.image,
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const all = await getProducts();
  const related = all
    .filter((x) => x.slug !== p.slug && (x.fragrance === p.fragrance || x.category === p.category))
    .sort((a, b) => Number(b.fragrance === p.fragrance) - Number(a.fragrance === p.fragrance))
    .slice(0, 4);

  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: p.name.en, path: `/products/${p.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(productJsonLd(p))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(crumbs)} />
      <ProductDetail p={p} related={related} />
    </>
  );
}
