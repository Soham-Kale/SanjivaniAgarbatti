'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function AboutMore() {
  const { t } = useLang();
  const { mission } = useContent().about;
  return (
    <section className="border-y border-charcoal/10 bg-ivory-2 py-24">
      <div className="wrap grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="eyebrow">{t(mission.eyebrow)}</div>
          <h2 className="h-section mt-3">
            {t(mission.title)}
          </h2>
          <ul className="mt-6 grid gap-3 text-charcoal-soft">
            {mission.items.map((g, i) => (
              <li key={i}>
                <span className="mr-2 text-gold-deep">✦</span>
                {t(g)}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[22px] border border-gold/40 shadow-lift">
            <Image src={mission.image || '/images/brand/visiting-card.jpg'} alt="संजीवनी व्हिजिटिंग कार्ड" fill sizes="384px" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
