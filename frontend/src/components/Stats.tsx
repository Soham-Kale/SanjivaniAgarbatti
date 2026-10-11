'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';

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
    <b ref={ref} className="block font-display text-[1.9rem] tabular-nums text-gold">
      {lang === 'mr' ? toMr(v) : v}
      {suffix}
    </b>
  );
}

export default function Stats() {
  const { t } = useLang();
  const items = [
    { n: 40, s: { mr: '+ मि.', en: '+ min' }, l: { mr: 'एक अगरबत्ती जळते', en: 'one stick burns' } },
    { n: 2, s: { mr: '+ तास', en: '+ hrs' }, l: { mr: 'कप धूप जळतो', en: 'cup dhoop burns' } },
    { n: 12, s: { mr: '+', en: '+' }, l: { mr: 'सुगंध', en: 'fragrances' } },
    { n: 3, s: { mr: '', en: '' }, l: { mr: 'फ्रँचायझी प्लॅन', en: 'franchise plans' } },
  ];
  return (
    <div className="grid grid-cols-2 border-y border-line bg-ink-2 md:grid-cols-4">
      {items.map((it, i) => (
        <div key={i} className="border-b border-line px-4 py-[22px] text-center odd:border-r md:border-b-0 md:border-r md:last:border-r-0">
          <Count to={it.n} suffix={t(it.s)} />
          <span className="text-[.88rem] text-muted">{t(it.l)}</span>
        </div>
      ))}
    </div>
  );
}
