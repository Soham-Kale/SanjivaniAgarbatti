'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHead from './SectionHead';
import Tilt from './Tilt';
import Aurora from './fx/Aurora';
import { useLang } from '@/lib/i18n';
import { FRAGRANCES } from '@/lib/fragrances';
import { useWa } from '@/lib/content-context';
import { setSmokeTint } from '@/lib/smoke';

export default function FragranceExplorer() {
  const { t } = useLang();
  const waLink = useWa();
  const [i, setI] = useState(0);
  const f = FRAGRANCES[i];
  const tint = `#${f.tint.toString(16).padStart(6, '0')}`;

  // the hero smoke picks up the selected fragrance's colour
  useEffect(() => setSmokeTint(f.tint), [f.tint]);

  return (
    <section id="fragrance" className="on-dark section relative scroll-mt-20 overflow-hidden bg-wood-night text-ivory" aria-labelledby="frag-title">
      <Aurora tone="cool" />
      {/* glow takes the colour of the chosen fragrance */}
      <motion.div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full opacity-40 blur-[120px]" animate={{ backgroundColor: tint }} transition={{ duration: 1.2 }} />
      <div className="wrap relative">
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
                className="relative shrink-0 rounded-full border border-white/15 px-4 py-2 text-left font-display text-[1.1rem] text-mist transition-all duration-300 hover:text-ivory aria-selected:border-transparent aria-selected:bg-gradient-to-r aria-selected:from-saffron aria-selected:to-gold aria-selected:text-wood-night lg:rounded-none lg:border-0 lg:border-b lg:border-white/10 lg:px-0 lg:py-3 lg:text-[1.5rem] lg:aria-selected:bg-none lg:aria-selected:pl-3 lg:aria-selected:text-gold-light"
              >
                {k === i && <motion.span layoutId="frag-dot" className="absolute -left-5 top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-saffron shadow-glow-sm lg:block" />}
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
              <div className="relative mx-auto w-full max-w-[340px] md:max-w-none">
                <div aria-hidden className="pointer-events-none absolute -inset-6 animate-spin-slow rounded-t-full border border-dashed border-gold/30" />
                <div aria-hidden className="pointer-events-none absolute -inset-12 animate-spin-slower rounded-full border border-white/5" />
                <Tilt max={10} className="relative">
                  <motion.div initial={{ clipPath: 'inset(0 0 100% 0 round 999px 999px 24px 24px)' }} animate={{ clipPath: 'inset(0 0 0% 0 round 999px 999px 24px 24px)' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full border border-gold/40" style={{ boxShadow: `0 40px 120px -30px ${tint}` }}>
                    <Image src={f.image} alt={`${f.name.mr} धूप`} fill sizes="(max-width: 768px) 340px, 420px" className="object-cover" />
                  </motion.div>
                </Tilt>
              </div>
              <div>
                <div className="eyebrow">{t({ mr: 'धूप कांडी · अगरबत्ती', en: 'Dhoop sticks · Agarbatti' })}</div>
                <h3 id="frag-title" className="text-gradient mt-2 text-[clamp(2.8rem,6vw,4.4rem)] leading-[1.2]">{f.name.mr}</h3>
                <div className="font-display text-[1.15rem] italic text-mist">{f.name.en}</div>
                <ul className="mt-5 grid gap-2.5 text-ivory/90">
                  {f.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron shadow-glow-sm" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a className="btn-gold mt-7" href={waLink(`${f.name.mr} धूप ऑर्डर`)} target="_blank" rel="noopener">
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
