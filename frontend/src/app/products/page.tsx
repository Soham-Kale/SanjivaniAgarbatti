import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/api';
import type { Category } from '@/lib/types';

export const metadata: Metadata = {
  title: 'उत्पादने',
  description: 'संजीवनी अगरबत्ती, प्रीमियम जार, धूप कांडी बॉक्स व जार, कप धूप आणि पूजा साहित्य.',
};

const VALID = ['daily', 'premium', 'dhoop', 'cup', 'puja'];

export default async function ProductsPage({ searchParams }: { searchParams: { c?: string } }) {
  const products = await getProducts();
  const initial = (VALID.includes(searchParams.c ?? '') ? searchParams.c : 'all') as Category | 'all';
  return (
    <>
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
