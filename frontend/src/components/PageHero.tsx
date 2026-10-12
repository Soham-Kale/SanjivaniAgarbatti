'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Aurora from './fx/Aurora';
import SplitWords from './fx/SplitWords';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

/**
 * Dark opening band for inner pages: drifting glow, turning gold rings in perspective, and an
 * animated title. Sits under the transparent header like the home hero.
 */
export default function PageHero({ eyebrow, title, text, children }: { eyebrow: I18n; title: I18n; text?: I18n; children?: React.ReactNode }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const o = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);
  const ringRot = useTransform(scrollYProgress, [0, 1], [62, reduce ? 62 : 80]);

  return (
    <section ref={ref} className="on-dark relative -mt-[72px] overflow-hidden bg-wood-night pb-20 pt-[calc(72px+4.5rem)] text-ivory md:pb-28 md:pt-[calc(72px+6rem)]">
      <Aurora tone="pink" />
      {/* gold rings seen in perspective, like a thali from the side */}
      <div aria-hidden className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 md:block" style={{ perspective: 900 }}>
        <motion.div style={{ rotateX: ringRot }} className="absolute inset-0">
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-gold/40" />
          <div className="absolute inset-10 animate-spin-slower rounded-full border border-dashed border-saffron/40" />
          <div className="absolute inset-24 rounded-full border border-lotus/30" />
          <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-saffron/50 to-maroon/40 blur-2xl" />
        </motion.div>
      </div>
      <motion.div style={{ y, opacity: o }} className="wrap relative">
        <motion.div className="eyebrow" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {t(eyebrow)}
        </motion.div>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,6.4vw,5rem)] leading-[1.18] text-ivory">
          <SplitWords text={t(title)} immediate delay={0.15} />
        </h1>
        {text && (
          <motion.p className="lede mt-5 max-w-[60ch]" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
            {t(text)}
          </motion.p>
        )}
        {children}
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </section>
  );
}
