import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { NoProfitNote, Plans, Steps } from '@/components/FranchisePlans';
import FranchiseInfo from '@/components/FranchiseInfo';
import EnquiryForm from '@/components/EnquiryForm';
import T from '@/components/T';
import { getContent } from '@/lib/api';
import { FRANCHISE_FAQ } from '@/lib/faq';
import { breadcrumbJsonLd, faqJsonLd, ldJson, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'फ्रँचायझी · Agarbatti Franchise in Maharashtra',
  description:
    'संजीवनी अगरबत्ती फ्रँचायझी: मिनी, संजीवनी फ्रँचायझी व वेअरहाऊस प्लॅन, संपूर्ण महाराष्ट्रात. Sanjivani Agarbatti franchise: Mini, Franchise and Warehouse plans across Maharashtra. No profit guarantee.',
  path: '/franchise',
});

const PLAN_IDS = ['mini', 'franchise', 'warehouse'];

export default async function FranchisePage({ searchParams }: { searchParams: { plan?: string } }) {
  const { franchise } = await getContent();
  const plan = PLAN_IDS.includes(searchParams.plan ?? '') ? searchParams.plan! : 'franchise';
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(faqJsonLd(FRANCHISE_FAQ.map((f) => ({ q: `${f.q.mr} (${f.q.en})`, a: `${f.a.mr} ${f.a.en}` }))))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Franchise', path: '/franchise' }]))} />
      <PageHero eyebrow={franchise.eyebrow} title={franchise.title} text={franchise.text} />
      <section className="wrap relative z-10 -mt-10 pb-20" aria-labelledby="plans-title">
        <h2 id="plans-title" className="sr-only">
          <T mr="फ्रँचायझी प्लॅन" en="Franchise plans" />
        </h2>
        <Plans withCta />
        <Steps />
        <NoProfitNote />
      </section>

      <FranchiseInfo />

      <section className="wrap pb-24">
        <div id="enquiry" className="glow-border relative grid scroll-mt-24 gap-10 overflow-hidden rounded-[32px] border border-charcoal/10 bg-white/80 p-6 shadow-lift backdrop-blur md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <div className="eyebrow"><T mr="फ्रँचायझी चौकशी" en="Franchise enquiry" /></div>
            <h2 className="mt-2.5 text-[2rem] text-wood"><T mr="तुमच्या गावात संजीवनी सुरू करूया" en="Let's start Sanjivani in your town" /></h2>
            <p className="text-stone"><T mr="फॉर्म भरा, आमची टीम तुमच्याशी संपर्क करेल." en="Fill in the form and our team will get in touch." /></p>
          </div>
          <EnquiryForm type="franchise" defaultPlan={plan} />
        </div>
      </section>
    </>
  );
}
