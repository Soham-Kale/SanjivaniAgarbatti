import type { Metadata } from 'next';
import AboutFounders from '@/components/AboutFounders';
import AboutMore from '@/components/AboutMore';
import WhyUs from '@/components/WhyUs';
import Gallery from '@/components/Gallery';

export const metadata: Metadata = {
  title: 'आमच्याविषयी',
  description: 'संजीवनी धूप आणि अगरबत्ती, माळेवाडी-अकलूज. संस्थापक, ध्येय व उद्देश.',
};

export default function AboutPage() {
  return (
    <>
      <AboutFounders headingLevel="h1" />
      <AboutMore />
      <WhyUs />
      <Gallery />
    </>
  );
}
