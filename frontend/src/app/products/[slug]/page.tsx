import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getLocalProducts, getProduct, getProducts } from '@/lib/api';

export function generateStaticParams() {
  return getLocalProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name.mr} · ${p.name.en}`,
    description: p.description.mr,
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const all = await getProducts();
  const related = all
    .filter((x) => x.slug !== p.slug && (x.fragrance === p.fragrance || x.category === p.category))
    .sort((a, b) => Number(b.fragrance === p.fragrance) - Number(a.fragrance === p.fragrance))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.name.mr} (${p.name.en})`,
    image: p.image,
    description: p.description.mr,
    brand: { '@type': 'Brand', name: 'Sanjivani' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail p={p} related={related} />
    </>
  );
}
