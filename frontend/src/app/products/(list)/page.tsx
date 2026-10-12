import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/api';
import { abs, breadcrumbJsonLd, ldJson, pageMeta } from '@/lib/seo';
import type { Category } from '@/lib/types';

export const metadata: Metadata = pageMeta({
  title: 'उत्पादने · Agarbatti, Dhoop & Puja Sahitya',
  description:
    'संजीवनी अगरबत्तीची संपूर्ण श्रेणी: दैनंदिन व प्रीमियम अगरबत्ती, धूप कांडी, कप धूप आणि पूजा साहित्य. Sanjivani Agarbatti, Akluj: daily and premium agarbatti, dhoop sticks, cup dhoop and puja sahitya.',
  path: '/products',
});

const VALID = ['daily', 'premium', 'dhoop', 'cup', 'puja'];

export default async function ProductsPage({ searchParams }: { searchParams: { c?: string } }) {
  const products = await getProducts();
  const initial = (VALID.includes(searchParams.c ?? '') ? searchParams.c : 'all') as Category | 'all';
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sanjivani Agarbatti products',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}`), name: `${p.name.en} (${p.name.mr})` })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(list)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }]))} />
      <PageHero
        eyebrow={{ mr: 'आमची उत्पादने', en: 'Our products' }}
        title={{ mr: 'संपूर्ण उत्पादन श्रेणी', en: 'The complete range' }}
        text={{
          mr: 'किमान ४० मिनिटे जळणारी अगरबत्ती, कमी धूर आणि हाताला रंग न लागणारी. घाऊक दरासाठी डीलर चौकशी करा.',
          en: 'Agarbatti that burns at least 40 minutes, with low smoke and no colour on your hands. Ask for dealer rates.',
        }}
      />
      <section className="wrap pb-24 pt-10">
        <ProductGrid key={initial} products={products} initial={initial} />
      </section>
    </>
  );
}
