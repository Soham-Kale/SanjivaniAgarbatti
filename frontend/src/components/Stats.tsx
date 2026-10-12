'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
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
    <b ref={ref} className="block font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-normal tabular-nums text-wood">
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
    <section aria-label={t({ mr: 'ठळक माहिती', en: 'Highlights' })} className="border-b border-charcoal/10 bg-ivory">
      <div className="wrap grid grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className={`px-3 py-8 text-center md:py-10 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} border-charcoal/10 md:border-r md:last:border-r-0`}>
            <Count to={it.n} suffix={t(it.s)} />
            <span className="text-[.88rem] text-stone">{t(it.l)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
