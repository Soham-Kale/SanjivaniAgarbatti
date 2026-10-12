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
    <section id="franchise" className="section relative scroll-mt-20 overflow-hidden bg-sand/50" aria-labelledby="fr-title">
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
