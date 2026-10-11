'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';
import { FRAGRANCES } from '@/lib/fragrances';
import { waLink } from '@/lib/site';
import { setSmokeTint } from '@/lib/smoke';

export default function FragranceExplorer() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const f = FRAGRANCES[i];

  useEffect(() => setSmokeTint(f.tint), [f.tint]);

  return (
    <section id="fragrance" className="section scroll-mt-16 border-y border-line bg-ink-2">
      <div className="wrap">
        <SectionHead
          eyebrow={{ mr: 'सुगंध निवडा', en: 'Choose a fragrance' }}
          title={{ mr: 'प्रत्येक सुगंधाची स्वतःची कथा', en: 'Every fragrance has its own story' }}
        />
        <div className="grid items-center gap-12 lg:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="सुगंध" className="flex flex-row flex-wrap gap-x-4 gap-y-1.5 lg:flex-col lg:gap-1">
            {FRAGRANCES.map((x, k) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={k === i}
                onClick={() => setI(k)}
                className="py-1 text-left font-display text-[1.2rem] text-[#6d6153] transition-all duration-300 hover:pl-3.5 hover:text-ivory aria-selected:pl-3.5 aria-selected:text-gold lg:text-[1.6rem]"
              >
                {t(x.name)}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="grid min-w-0 items-center gap-8 md:grid-cols-2"
            >
              <div className="relative aspect-[4/5] max-w-[320px] overflow-hidden rounded-[200px_200px_18px_18px] border border-gold-soft shadow-ember md:max-w-none">
                <Image src={f.image} alt={`${f.name.mr} धूप`} fill sizes="(max-width: 768px) 320px, 400px" className="object-cover" />
              </div>
              <div>
                <div className="eyebrow">{t({ mr: 'धूप कांडी · अगरबत्ती', en: 'Dhoop sticks · Agarbatti' })}</div>
                <h3 className="text-[2.6rem] text-gold">{f.name.mr}</h3>
                <div className="font-display italic text-muted">{f.name.en}</div>
                <ul className="my-4 list-disc pl-[18px] text-[#d9ccb8]">
                  {f.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a className="btn-ghost" href={waLink(`${f.name.mr} धूप ऑर्डर`)} target="_blank" rel="noopener">
                  {t({ mr: 'ऑर्डर करा', en: 'Order now' })}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
