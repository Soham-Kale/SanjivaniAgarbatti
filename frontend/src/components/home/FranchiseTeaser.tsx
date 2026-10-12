'use client';

import Link from 'next/link';
import SectionHead from '../SectionHead';
import { NoProfitNote, Plans } from '../FranchisePlans';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function FranchiseTeaser() {
  const { t } = useLang();
  const { franchise } = useContent();
  return (
    <section id="franchise" className="section relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-ivory via-sand/70 to-ivory" aria-labelledby="fr-title">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-saffron/15 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-wood-light/15 blur-[110px]" />
      <div className="wrap relative">
        <SectionHead
          eyebrow={franchise.eyebrow}
          title={franchise.title}
          text={franchise.text}
        />
        <Plans withCta />
        <NoProfitNote />
        <div className="mt-10">
          <Link href="/franchise" className="btn-primary">{t({ mr: 'फ्रँचायझीची संपूर्ण माहिती', en: 'Full franchise details' })} →</Link>
        </div>
      </div>
    </section>
  );
}
