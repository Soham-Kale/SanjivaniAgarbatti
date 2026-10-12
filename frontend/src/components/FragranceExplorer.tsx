'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';
import { FRAGRANCES } from '@/lib/fragrances';
import { useWa } from '@/lib/content-context';
import { setSmokeTint } from '@/lib/smoke';

export default function FragranceExplorer() {
  const { t } = useLang();
  const waLink = useWa();
  const [i, setI] = useState(0);
  const f = FRAGRANCES[i];

  // the hero smoke picks up the selected fragrance's colour
  useEffect(() => setSmokeTint(f.tint), [f.tint]);

  return (
    <section id="fragrance" className="section scroll-mt-20 bg-ivory-2" aria-labelledby="frag-title">
      <div className="wrap">
        <SectionHead
          eyebrow={{ mr: 'सुगंध निवडा', en: 'Choose a fragrance' }}
          title={{ mr: 'प्रत्येक सुगंधाची स्वतःची कथा', en: 'Every fragrance has its own story' }}
        />
        <div className="grid items-center gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <div role="tablist" aria-label={t({ mr: 'सुगंध', en: 'Fragrances' })} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {FRAGRANCES.map((x, k) => (
              <button
                key={x.id}
                role="tab"
                id={`tab-${x.id}`}
                aria-controls="frag-panel"
                aria-selected={k === i}
                onClick={() => setI(k)}
                className="relative shrink-0 rounded-full border border-charcoal/15 px-4 py-2 text-left font-display text-[1.1rem] text-stone transition-colors aria-selected:border-wood aria-selected:bg-wood aria-selected:text-ivory lg:rounded-none lg:border-0 lg:border-b lg:border-charcoal/10 lg:px-0 lg:py-3 lg:text-[1.5rem] lg:aria-selected:bg-transparent lg:aria-selected:text-wood"
              >
                {k === i && <motion.span layoutId="frag-dot" className="absolute -left-5 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-gold lg:block" />}
                {t(x.name)}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id}
              id="frag-panel"
              role="tabpanel"
              aria-labelledby={`tab-${f.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-w-0 items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <motion.div initial={{ clipPath: 'inset(0 0 100% 0 round 999px 999px 24px 24px)' }} animate={{ clipPath: 'inset(0 0 0% 0 round 999px 999px 24px 24px)' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-t-full border border-gold/40 shadow-lift md:max-w-none">
                <Image src={f.image} alt={`${f.name.mr} धूप`} fill sizes="(max-width: 768px) 340px, 420px" className="object-cover" />
              </motion.div>
              <div>
                <div className="eyebrow">{t({ mr: 'धूप कांडी · अगरबत्ती', en: 'Dhoop sticks · Agarbatti' })}</div>
                <h3 id="frag-title" className="mt-2 text-[clamp(2.4rem,5vw,3.4rem)] text-wood">{f.name.mr}</h3>
                <div className="font-display text-[1.1rem] italic text-sandal">{f.name.en}</div>
                <ul className="mt-5 grid gap-2.5 text-charcoal-soft">
                  {f.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a className="btn-outline mt-7" href={waLink(`${f.name.mr} धूप ऑर्डर`)} target="_blank" rel="noopener">
                  {t({ mr: 'WhatsApp वर ऑर्डर', en: 'Order on WhatsApp' })}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
