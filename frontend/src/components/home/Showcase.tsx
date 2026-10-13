'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Aurora from '../fx/Aurora';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { DEFAULT_CONTENT } from '@/lib/content';

const ShowcaseScene = dynamic(() => import('../3d/ShowcaseScene'), { ssr: false });

// Each step is tied to a 3D model by its product slug; the text comes from the admin's website content.
const SLUGS = ['premium-mogra', 'dhoop-box-chandan', 'premium-chandan', 'dhoop-box-jaswand', 'pouch-gulab'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Sticky, scroll-driven 3D showcase of five real packs. */
export default function Showcase() {
  const { t } = useLang();
  const { showcase } = useContent();
  const STEPS = SLUGS.map((slug, k) => ({ slug, ...(showcase.steps[k] ?? DEFAULT_CONTENT.showcase.steps[k]) }));
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [i, setI] = useState(0);
  const [low, setLow] = useState(false);
  const near = useInView(ref, { once: true, margin: '600px' });
  useEffect(() => setLow(window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4), []);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(STEPS.length - 1, Math.round(v * (STEPS.length - 1)))));
  const s = STEPS[i];

  return (
    <section ref={ref} className="on-dark relative bg-wood-night text-ivory" style={{ height: `${STEPS.length * 70 + 40}vh` }} aria-label={t({ mr: '3D उत्पादन दर्शन', en: '3D product showcase' })}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <Aurora tone="cool" />
        {/* big counter behind the scene */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={i}
            aria-hidden
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-outline pointer-events-none absolute right-[4%] top-[8%] font-display text-[clamp(8rem,22vw,20rem)] leading-none"
          >
            {pad(i + 1)}
          </motion.span>
        </AnimatePresence>
        <div className="wrap relative grid flex-1 items-center gap-2 pt-16 lg:grid-cols-[1.25fr_1fr] lg:pt-0">
          <div className="relative h-[48svh] lg:h-[82svh]">
            {near && <ShowcaseScene slugs={SLUGS} progress={scrollYProgress} low={low} />}
          </div>
          <div className="relative pb-10 lg:pb-0">
            <div className="eyebrow">{t(showcase.eyebrow)}</div>
            <AnimatePresence mode="wait">
              <motion.div key={s.slug} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                <p className="mt-4 text-[.85rem] font-semibold uppercase tracking-[.14em] text-saffron">{t(s.k)}</p>
                <h2 className="mt-2 text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.2] text-ivory">{t(s.h)}</h2>
                <p className="mt-3 max-w-md text-mist">{t(s.p)}</p>
                <Link href={`/products/${s.slug}`} className="btn-gold mt-7">{t({ mr: 'उत्पादन पाहा', en: 'View product' })} →</Link>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex items-center gap-4" aria-hidden>
              <span className="font-display text-[1.1rem] text-gold-light">{pad(i + 1)}</span>
              <div className="flex gap-1.5">
                {STEPS.map((x, k) => (
                  <span key={x.slug} className={`h-1 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-gradient-to-r from-saffron to-gold' : 'w-4 bg-ivory/20'}`} />
                ))}
              </div>
              <span className="font-display text-[1.1rem] text-mist/50">{pad(STEPS.length)}</span>
            </div>
            {/* <p className="mt-5 text-[.78rem] text-mist/60">{t({ mr: '3D मॉडेल खऱ्या पॅकच्या फोटोवरून तयार केले आहेत.', en: '3D models are built from photos of the real packs.' })}</p> */}
          </div>
        </div>
      </div>
    </section>
  );
}
