import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import FragranceRibbon from '@/components/home/FragranceRibbon';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryDiscovery from '@/components/home/CategoryDiscovery';
import BrandStory from '@/components/home/BrandStory';
import Showcase from '@/components/home/Showcase';
import FragranceExplorer from '@/components/FragranceExplorer';
import WhyUs from '@/components/WhyUs';
import FranchiseTeaser from '@/components/home/FranchiseTeaser';
import ClosingMoment from '@/components/home/ClosingMoment';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/api';
import { abs } from '@/lib/seo';

export const metadata: Metadata = { alternates: { canonical: abs('/') }, openGraph: { url: abs('/') } };

// Section 8 (customer reviews) is intentionally absent: there are no genuine reviews yet.
export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const fragranceCount = new Set(products.map((p) => p.fragrance).filter(Boolean)).size;
  return (
    <>
      <Hero />
      <FragranceRibbon />
      <Stats productCount={products.length} fragranceCount={fragranceCount} />
      <FeaturedProducts products={featured} total={products.length} />
      <CategoryDiscovery products={products} />
      <BrandStory />
      <Showcase />
      <WhyUs />
      <FragranceExplorer />
      <FranchiseTeaser />
      <ClosingMoment />
    </>
  );
}
