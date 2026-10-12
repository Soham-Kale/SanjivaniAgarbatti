import type { Metadata } from 'next';
import AboutFounders from '@/components/AboutFounders';
import AboutMore from '@/components/AboutMore';
import WhyUs from '@/components/WhyUs';
import Gallery from '@/components/Gallery';
import { getContent } from '@/lib/api';
import { SITE_URL, abs, ldJson, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'आमच्याविषयी · About Sanjivani Agarbatti & Founders',
  description:
    'संजीवनी धूप आणि अगरबत्ती, माळेवाडी-अकलूज: संस्थापक श्री. सोमनाथ पी. घोडके (Founder & CEO) व श्री. ओंकार डी. थिटे (Founder & MD), आमचे ध्येय व उद्देश. Sanjivani Agarbatti was founded by Somnath P. Ghodake and Onkar D. Thite.',
  path: '/about',
});

export default async function AboutPage() {
  const { site } = await getContent();
  const page = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: abs('/about'),
    name: 'About Sanjivani Agarbatti',
    about: { '@id': `${SITE_URL}/#organization` },
    mentions: site.phones.map((_, i) => ({ '@id': `${SITE_URL}/about#founder-${i + 1}` })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(page)} />
      <AboutFounders headingLevel="h1" />
      <AboutMore />
      <WhyUs />
      <Gallery />
    </>
  );
}
