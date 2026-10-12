'use client';

import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import Tilt from './Tilt';
import { rise, stagger } from './Reveal';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

const MR_DIGITS = '०१२३४५६७८९';
const toMr = (n: number) => String(n).replace(/\d/g, (d) => MR_DIGITS[Number(d)]);

function Count({ to, suffix }: { to: number; suffix: string }) {
  const { lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, reduce, to]);
  return (
    <b ref={ref} className="text-gradient block font-display text-[clamp(2.2rem,4vw,3.2rem)] font-normal leading-tight tabular-nums">
      {lang === 'mr' ? toMr(v) : v}
      {suffix}
    </b>
  );
}

/** Trust strip of verified numbers (burn times from the catalogue, counts from the product data). */
export default function Stats({ productCount, fragranceCount }: { productCount: number; fragranceCount: number }) {
  const { t } = useLang();
  const items: { n: number; s: I18n; l: I18n }[] = [
    { n: 40, s: { mr: '+ मि.', en: '+ min' }, l: { mr: 'एक अगरबत्ती किमान जळते', en: 'minimum burn per stick' } },
    { n: 2, s: { mr: '+ तास', en: '+ hrs' }, l: { mr: 'एक कप धूप जळतो', en: 'per cup dhoop' } },
    { n: fragranceCount, s: { mr: '', en: '' }, l: { mr: 'सुगंध', en: 'fragrances' } },
    { n: productCount, s: { mr: '', en: '' }, l: { mr: 'उत्पादने', en: 'products' } },
  ];
  return (
    <section aria-label={t({ mr: 'ठळक माहिती', en: 'Highlights' })} className="on-dark relative overflow-hidden bg-wood-night py-14 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <motion.ul className="wrap grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {items.map((it, i) => (
          <motion.li key={i} variants={rise} className="group relative">
            <Tilt max={10} className="glass glow-border hover-glow relative h-full rounded-[22px] px-4 py-7 text-center md:py-9">
              <Count to={it.n} suffix={t(it.s)} />
              <span className="mt-1 block text-[.88rem] text-mist">{t(it.l)}</span>
            </Tilt>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
