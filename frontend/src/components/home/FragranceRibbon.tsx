'use client';

import Marquee from '../fx/Marquee';
import { useLang } from '@/lib/i18n';
import { FRAGRANCES } from '@/lib/fragrances';

/** A ribbon of fragrance names in the saffron-gold-lotus gradient that drifts with the scroll. */
export default function FragranceRibbon() {
  const { t } = useLang();
  const names = FRAGRANCES.map((f) => t(f.name));
  return (
    <section aria-hidden="true" className="relative z-10 overflow-hidden bg-wood-night py-12">
      <div className="-mx-[5%] -rotate-1 bg-gradient-to-r from-saffron via-gold to-lotus py-3 text-wood-night shadow-glow-sm">
        <Marquee items={names} />
      </div>
    </section>
  );
}
