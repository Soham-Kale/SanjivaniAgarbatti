'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Reveal, { MaskReveal } from '../Reveal';
import SplitWords from '../fx/SplitWords';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';

export default function BrandStory() {
  const { t } = useLang();
  const { story } = useContent();
  const reduce = useReducedMotion();
  const [lead, ...shots] = story.photos;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const slow = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const fast = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [110, -110]);
  const line = useTransform(scrollYProgress, [0.2, 0.7], ['0%', '100%']);
  // The two small photos drift at different speeds on wide screens only; on phones they stay level.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <section ref={ref} className="section relative overflow-hidden bg-gradient-to-b from-ivory via-sand/60 to-ivory" aria-labelledby="story-title">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-20 h-[460px] w-[460px] rounded-full bg-lotus/20 blur-[110px]" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* shop photo with two real packs; each image says what it shows */}
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
          {lead && (
            <motion.figure style={{ y: slow }} className="col-span-2">
              <MaskReveal className="relative aspect-[16/10] overflow-hidden rounded-[28px] shadow-lift">
                <Image src={media(lead.src)} alt={t(lead.cap)} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-wood/80 px-4 py-1.5 text-[.8rem] text-ivory backdrop-blur">{t(lead.cap)}</span>
              </MaskReveal>
            </motion.figure>
          )}
          {shots.slice(0, 2).map((s, i) => (
            <motion.figure key={s.src} style={{ y: wide && i === 0 ? fast : slow }}>
              <MaskReveal delay={0.15 + i * 0.1} className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-lift">
                <Image src={media(s.src)} alt={t(s.cap)} fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover transition duration-[1.2s] hover:scale-105" />
              </MaskReveal>
              <figcaption className="mt-2 text-[.82rem] leading-snug text-stone">{t(s.cap)}</figcaption>
            </motion.figure>
          ))}
          <div aria-hidden className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 animate-spin-slower rounded-full border border-dashed border-gold/50" />
        </div>

        <div>
          <Reveal y={12}>
            <div className="eyebrow">{t(story.eyebrow)}</div>
          </Reveal>
          <h2 id="story-title" className="h-section mt-3">
            <SplitWords text={t(story.title)} />
          </h2>
          <div className="relative mt-10">
            {/* gold thread that fills as you read */}
            <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-[2px] rounded-full bg-gold/20">
              <motion.div style={{ height: line }} className="w-full rounded-full bg-gradient-to-b from-saffron via-gold to-maroon" />
            </div>
            <ol className="grid gap-10">
              {story.chapters.map((c, i) => (
                <Reveal as="li" key={i} delay={i * 0.08} className="relative pl-12">
                  <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-saffron to-maroon text-[.7rem] font-bold text-white shadow-glow-sm">{i + 1}</span>
                  <span className="text-[.8rem] font-semibold uppercase tracking-[.14em] text-gold-deep">{t(c.k)}</span>
                  <h3 className="mt-1 text-[1.6rem] text-wood">{t(c.h)}</h3>
                  <p className="mt-2 text-stone">{t(c.p)}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="mt-10">
            <Link href="/about" className="btn-primary">{t({ mr: 'संस्थापक व पूर्ण कथा वाचा', en: 'Meet the founders' })} →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
