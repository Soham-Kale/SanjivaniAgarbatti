import type { Metadata } from 'next';
import SectionHead from '@/components/SectionHead';
import { NoProfitNote, Plans, Steps } from '@/components/FranchisePlans';
import FranchiseInfo from '@/components/FranchiseInfo';
import EnquiryForm from '@/components/EnquiryForm';
import T from '@/components/T';

export const metadata: Metadata = {
  title: 'फ्रँचायझी',
  description: 'संजीवनी अगरबत्ती फ्रँचायझी: मिनी, संजीवनी फ्रँचायझी व वेअरहाऊस प्लॅन. संपूर्ण महाराष्ट्रात उपलब्ध.',
};

const PLAN_IDS = ['mini', 'franchise', 'warehouse'];

export default function FranchisePage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = PLAN_IDS.includes(searchParams.plan ?? '') ? searchParams.plan! : 'franchise';
  return (
    <>
      <section className="section wrap pt-16">
        <SectionHead
          as="h1"
          eyebrow={{ mr: 'फ्रँचायझी · संपूर्ण महाराष्ट्र', en: 'Franchise · All Maharashtra' }}
          title={{ mr: 'तुमची गुंतवणूक, आमचा ब्रँड, दोघांची प्रगती', en: 'Your investment, our brand, growth for both' }}
          text={{
            mr: 'तुमच्या गावात संजीवनीचे दुकान सुरू करा. ब्रँड, माल पुरवठा, प्रशिक्षण आणि मार्केटिंग सहाय्य आमच्याकडून.',
            en: 'Open a Sanjivani shop in your town. Brand, stock supply, training and marketing support from us.',
          }}
        />
        <Plans withCta />
        <Steps />
        <NoProfitNote />
      </section>

      <FranchiseInfo />

      <section className="wrap pb-24">
        <div id="enquiry" className="grid scroll-mt-24 gap-10 rounded-3xl border border-line bg-ink-2 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <div className="eyebrow"><T mr="फ्रँचायझी चौकशी" en="Franchise enquiry" /></div>
            <h2 className="mt-2.5 text-[2rem]"><T mr="तुमच्या गावात संजीवनी सुरू करूया" en="Let's start Sanjivani in your town" /></h2>
            <p className="text-muted"><T mr="फॉर्म भरा, आमची टीम तुमच्याशी संपर्क करेल." en="Fill in the form and our team will get in touch." /></p>
          </div>
          <EnquiryForm type="franchise" defaultPlan={plan} />
        </div>
      </section>
    </>
  );
}
