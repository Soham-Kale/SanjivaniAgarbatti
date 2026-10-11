'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';

const GOALS = [
  { mr: 'ग्रामीण व शहरी युवक-युवतींना स्वयंरोजगाराची संधी', en: 'Self-employment for young people in villages and towns' },
  { mr: 'महिलांना व्यवसायात सहभागी होण्याची संधी', en: 'Business opportunities for women' },
  { mr: 'फ्रँचायझीधारकांना प्रशिक्षण व मार्गदर्शन', en: 'Training and guidance for franchisees' },
  { mr: 'प्रत्येक घरापर्यंत दर्जेदार पूजा साहित्य', en: 'Quality puja sahitya for every home' },
];

export default function AboutMore() {
  const { t } = useLang();
  return (
    <section className="border-y border-line bg-ink-2 py-24">
      <div className="wrap grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="eyebrow">{t({ mr: 'ध्येय व उद्देश', en: 'Mission & objectives' })}</div>
          <h2 className="mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)]">
            {t({ mr: 'सुगंधाची सुंदर अनुभूती, प्रत्येक घरात', en: 'A beautiful experience of fragrance, in every home' })}
          </h2>
          <ul className="mt-6 grid gap-3 text-sand">
            {GOALS.map((g) => (
              <li key={g.mr}>
                <span className="mr-2 text-gold">✦</span>
                {t(g)}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[22px] border border-gold-soft shadow-ember">
            <Image src="/images/brand/visiting-card.jpg" alt="संजीवनी व्हिजिटिंग कार्ड" fill sizes="384px" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
