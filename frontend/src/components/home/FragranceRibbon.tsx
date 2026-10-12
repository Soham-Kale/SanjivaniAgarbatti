'use client';

import Marquee from '../fx/Marquee';
import { useLang } from '@/lib/i18n';
import { FRAGRANCES } from '@/lib/fragrances';

/** Two crossing ribbons of fragrance names that drift with the scroll. */
export default function FragranceRibbon() {
  const { t } = useLang();
  const names = FRAGRANCES.map((f) => t(f.name));
  return (
    <section aria-hidden="true" className="relative z-10 overflow-hidden bg-wood-night py-12">
      <div className="-mx-[5%] -rotate-2 bg-gradient-to-r from-saffron via-gold to-lotus py-4 text-wood-night shadow-glow-sm">
        <Marquee items={names} />
      </div>
      <div className="absolute inset-x-[-5%] top-1/2 -z-10 -translate-y-1/2 rotate-2 bg-wood-light py-4 text-gold-light/80">
        <Marquee items={[...names].reverse()} speed={1.4} />
      </div>
    </section>
  );
}
