'use client';

import Link from 'next/link';
import SectionHead from '../SectionHead';
import { NoProfitNote, Plans } from '../FranchisePlans';
import { useLang } from '@/lib/i18n';

export default function FranchiseTeaser() {
  const { t } = useLang();
  return (
    <section id="franchise" className="on-dark section relative scroll-mt-20 overflow-hidden bg-forest text-ivory" aria-labelledby="fr-title">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="wrap relative">
        <SectionHead
          eyebrow={{ mr: 'फ्रँचायझी · संपूर्ण महाराष्ट्र', en: 'Franchise · All Maharashtra' }}
          title={{ mr: 'तुमची गुंतवणूक, आमचा ब्रँड, दोघांची प्रगती', en: 'Your investment, our brand, growth for both' }}
          text={{ mr: 'तुमच्या गावात संजीवनीचे दुकान सुरू करा. ब्रँड, माल पुरवठा, प्रशिक्षण आणि मार्केटिंग सहाय्य आमच्याकडून.', en: 'Open a Sanjivani shop in your town. Brand, stock supply, training and marketing support from us.' }}
        />
        <Plans withCta dark />
        <NoProfitNote dark />
        <div className="mt-10">
          <Link href="/franchise" className="btn-gold">{t({ mr: 'फ्रँचायझीची संपूर्ण माहिती', en: 'Full franchise details' })} →</Link>
        </div>
      </div>
    </section>
  );
}
