'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Component, Fragment, useCallback, useRef, useState } from 'react';
import Aurora from './fx/Aurora';
import { useLang } from '@/lib/i18n';
import { useIdleMount } from '@/lib/use-mount-3d';
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

/** Text running round a circle, turning slowly (the hero's seal). */
function RingText({ text }: { text: string }) {
  const line = `${text} ✦ ${text} ✦ `;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow" aria-hidden="true">
      <defs>
        <path id="ring-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="fill-gold-light font-body text-[13px] font-semibold tracking-[.18em]">
        <textPath href="#ring-path" textLength="485">{line}</textPath>
      </text>
    </svg>
  );
}

export default function Hero() {
  const { t } = useLang();
  const { hero } = useContent();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const show3d = useIdleMount();
  const onReady = useCallback(() => setReady(true), []);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const copyO = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.86]);

  // Words are separated by "|" in the admin panel; the second word is highlighted.
  const words = t(hero.title).split('|').map((w) => w.trim()).filter(Boolean);

  return (
    <section ref={ref} className="on-dark relative -mt-[72px] overflow-hidden bg-wood-night pt-[72px] text-ivory" aria-labelledby="hero-title">
      <Aurora />
      {/* a faint ring pattern, like a rangoli, behind everything */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[repeating-radial-gradient(circle,rgba(255,212,128,.05)_0_1px,transparent_1px_64px)]" />

      <div className="wrap relative grid min-h-[calc(100svh-72px)] items-center gap-4 pb-16 lg:grid-cols-[1fr_1.15fr] lg:pb-6">
        <motion.div style={{ y: copyY, opacity: copyO }} className="relative z-10 max-w-xl pt-10 lg:pt-0">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-[.8rem] font-semibold tracking-[.1em] text-gold-light backdrop-blur"
            initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron" />
            </span>
            {t(hero.eyebrow)}
          </motion.div>
          <h1 id="hero-title" className="mt-6 text-[clamp(3rem,7.6vw,6.2rem)] leading-[1.12] text-ivory">
            {words.map((w, i) => (
              <Fragment key={w + i}>
              {i > 0 && ' '}
              <span className="-my-[.3em] inline-block overflow-hidden pb-[.36em] pt-[.3em] align-top">
                <motion.span
                  className={`inline-block ${i === 1 ? 'text-gradient' : ''}`}
                  initial={reduce ? false : { y: '115%', rotate: 6 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.15, ease: EASE, delay: 0.25 + i * 0.13 }}
                >
                  {w}
                </motion.span>
              </span>
              </Fragment>
            ))}
          </h1>
          <motion.p className="mt-3 font-display text-[1.25rem] italic text-gold-light/90" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
            {hero.tagline}
          </motion.p>
          <motion.p className="mt-5 max-w-[46ch] text-[1.08rem] text-mist" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}>
            {t(hero.text)}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="btn-gold px-7" href="/products">{t(hero.ctaPrimary)} <span aria-hidden>→</span></Link>
            </motion.span>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="btn-outline-light px-7" href="/about">{t(hero.ctaSecondary)}</Link>
            </motion.span>
          </motion.div>
          <motion.p className="mt-8 hidden items-center gap-2 text-[.82rem] text-mist/70 lg:flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-ivory/20">↻</span>
            {t({ mr: 'जार फिरवण्यासाठी ओढा', en: 'Drag to turn the jar' })}
          </motion.p>
        </motion.div>

        <motion.div style={{ scale: sceneScale }} className="relative h-[460px] sm:h-[540px] lg:h-[min(86svh,800px)]">
          {/* poster: shown until the 3D scene is ready, and kept if WebGL is unavailable */}
          <motion.div className="absolute inset-0 grid place-items-center" animate={{ opacity: ready ? 0 : 1 }} transition={{ duration: 0.8 }} aria-hidden={ready}>
            <div className="relative aspect-[3/4] w-[min(62%,340px)] overflow-hidden rounded-t-full border border-gold/40 shadow-glow">
              <Image src={media(hero.poster)} alt="" fill priority sizes="340px" className="object-cover" />
            </div>
          </motion.div>
          {show3d && (
            <SceneBoundary>
              <IncenseScene onReady={onReady} progress={scrollYProgress} />
            </SceneBoundary>
          )}
          <motion.div
            className="pointer-events-none absolute right-2 top-6 hidden h-32 w-32 lg:block"
            initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: EASE, delay: 1.2 }}
          >
            <RingText text={t({ mr: 'संजीवनी धूप आणि अगरबत्ती', en: 'SANJIVANI DHOOP & AGARBATTI' })} />
            <span className="absolute inset-0 m-auto h-14 w-14 overflow-hidden rounded-full bg-ivory p-1 shadow-glow-sm ring-2 ring-gold/60"><Image src="/images/brand/logo-180.png" alt="" width={56} height={56} className="h-full w-full object-contain" /></span>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[.72rem] uppercase tracking-[.2em] text-mist/60 md:flex" style={{ opacity: copyO }}>
        <span className="flex h-9 w-5 justify-center rounded-full border border-ivory/30 pt-1.5">
          <span className="h-2 w-1 rounded-full bg-gold-light animate-wheel" />
        </span>
        {t({ mr: 'खाली स्क्रोल करा', en: 'Scroll' })}
      </motion.div>
    </section>
  );
}
