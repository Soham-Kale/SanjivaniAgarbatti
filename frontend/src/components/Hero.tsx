'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Component, useCallback, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';

const IncenseScene = dynamic(() => import('./IncenseScene'), { ssr: false });

/** Keeps the poster visible if WebGL is unavailable or the scene throws. */
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { t } = useLang();
  const { hero } = useContent();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const copyO = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  // Words are separated by "|" in the admin panel; the second word is highlighted in gold.
  const words = t(hero.title).split('|').map((w) => w.trim()).filter(Boolean);

  return (
    <section ref={ref} className="on-dark relative -mt-[72px] overflow-hidden bg-wood-deep pt-[72px] text-ivory" aria-labelledby="hero-title">
      {/* atmosphere: warm lamp glow, vignette, grain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_72%_55%,rgba(201,154,69,.32)_0%,rgba(43,25,14,0)_60%),radial-gradient(80%_60%_at_10%_0%,rgba(92,59,37,.75)_0%,rgba(43,25,14,0)_70%)]" />
      <div className="pointer-events-none absolute inset-0 grain" />

      <div className="wrap relative grid min-h-[calc(100svh-72px)] items-center gap-6 pb-10 lg:grid-cols-[1fr_1.15fr] lg:pb-0">
        <motion.div style={{ y: copyY, opacity: copyO }} className="relative z-10 max-w-xl pt-10 lg:pt-0">
          <motion.div className="eyebrow" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
            {t(hero.eyebrow)}
          </motion.div>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.9rem,7vw,5.6rem)] leading-[1.18] text-ivory">
            {words.map((w, i) => (
              <span key={w + i} className="mr-[.25em] inline-block overflow-hidden pb-[.12em] pt-[.08em] align-top">
                <motion.span
                  className={`inline-block ${i === 1 ? 'italic text-gold-light' : ''}`}
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.12 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-4 font-display text-[1.2rem] italic text-gold-light/90" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
            {hero.tagline}
          </motion.p>
          <motion.p className="mt-5 max-w-[46ch] text-[1.06rem] text-mist" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}>
            {t(hero.text)}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="btn-gold" href="/products">{t(hero.ctaPrimary)} <span aria-hidden>→</span></Link>
            </motion.span>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="btn-outline-light" href="/about">{t(hero.ctaSecondary)}</Link>
            </motion.span>
          </motion.div>
          <motion.p className="mt-8 hidden text-[.8rem] text-mist/70 lg:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            {t({ mr: '↻ जार फिरवण्यासाठी ओढा', en: '↻ Drag to turn the jar' })}
          </motion.p>
        </motion.div>

        <div className="relative h-[440px] sm:h-[520px] lg:h-[min(82svh,760px)]">
          {/* poster: shown until the 3D scene is ready, and kept if WebGL is unavailable */}
          <motion.div className="absolute inset-0 grid place-items-center" animate={{ opacity: ready ? 0 : 1 }} transition={{ duration: 0.8 }} aria-hidden={ready}>
            <div className="relative aspect-[3/4] w-[min(62%,340px)] overflow-hidden rounded-t-full border border-gold/40 shadow-glow">
              <Image src={media(hero.poster)} alt="" fill priority sizes="340px" className="object-cover" />
            </div>
          </motion.div>
          <SceneBoundary>
            <IncenseScene onReady={onReady} />
          </SceneBoundary>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
}
