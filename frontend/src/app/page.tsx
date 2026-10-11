import Link from 'next/link';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import SectionHead from '@/components/SectionHead';
import ProductGrid from '@/components/ProductGrid';
import FragranceExplorer from '@/components/FragranceExplorer';
import WhyUs from '@/components/WhyUs';
import { NoProfitNote, Plans, Steps } from '@/components/FranchisePlans';
import EnquiryForm from '@/components/EnquiryForm';
import AboutFounders from '@/components/AboutFounders';
import Gallery from '@/components/Gallery';
import T from '@/components/T';
import { getProducts } from '@/lib/api';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <Hero />
      <Stats />

      <section id="products" className="section wrap scroll-mt-16">
        <SectionHead
          eyebrow={{ mr: 'आमची उत्पादने', en: 'Our products' }}
          title={{ mr: 'प्रत्येक पूजेसाठी, एकाच ठिकाणी', en: 'For every puja, in one place' }}
          text={{ mr: 'रंग हाताला लागत नाही, कमी धूर आणि दीर्घकाळ टिकणारा सौम्य सुगंध.', en: 'Colour does not stick to hands, low smoke and a mild, long-lasting fragrance.' }}
        />
        <ProductGrid products={products} limit={12} />
        <div className="mt-10 text-center">
          <Link href="/products" className="btn-ghost">
            <T mr={`सर्व ${products.length} उत्पादने पाहा →`} en={`See all ${products.length} products →`} />
          </Link>
        </div>
      </section>

      <FragranceExplorer />
      <WhyUs />

      <section id="franchise" className="section wrap scroll-mt-16">
        <SectionHead
          eyebrow={{ mr: 'फ्रँचायझी · संपूर्ण महाराष्ट्र', en: 'Franchise · All Maharashtra' }}
          title={{ mr: 'तुमची गुंतवणूक, आमचा ब्रँड, दोघांची प्रगती', en: 'Your investment, our brand, growth for both' }}
          text={{
            mr: 'तुमच्या गावात संजीवनीचे दुकान सुरू करा. ब्रँड, माल पुरवठा, प्रशिक्षण आणि मार्केटिंग सहाय्य आमच्याकडून.',
            en: 'Open a Sanjivani shop in your town. Brand, stock supply, training and marketing support from us.',
          }}
        />
        <Plans />
        <Steps />
        <NoProfitNote />
        <div id="enquiry" className="mt-[70px] grid gap-10 rounded-3xl border border-line bg-ink-2 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <div className="eyebrow"><T mr="फ्रँचायझी चौकशी" en="Franchise enquiry" /></div>
            <h3 className="mt-2.5 text-[2rem]"><T mr="तुमच्या गावात संजीवनी सुरू करूया" en="Let's start Sanjivani in your town" /></h3>
            <p className="text-muted">
              <T mr="फॉर्म भरा, आमची टीम तुमच्याशी संपर्क करेल." en="Fill in the form and our team will get in touch." />{' '}
              <Link href="/franchise" className="text-gold underline"><T mr="संपूर्ण माहिती →" en="Full details →" /></Link>
            </p>
          </div>
          <EnquiryForm type="franchise" />
        </div>
      </section>

      <AboutFounders />
      <Gallery />
    </>
  );
}
