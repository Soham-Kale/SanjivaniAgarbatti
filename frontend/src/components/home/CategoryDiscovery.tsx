'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Aurora from '../fx/Aurora';
import SplitWords from '../fx/SplitWords';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';
import type { Category, Product } from '@/lib/types';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Categories as a horizontal gallery. On desktop the section pins while the visitor scrolls and
 * the cards slide sideways, leaning in 3D with the scroll speed. On phones it is a swipeable row.
 */
export default function CategoryDiscovery({ products }: { products: Product[] }) {
  const { t, lang } = useLang();
  const { categories: CATEGORY_INFO } = useContent();
  const reduce = useReducedMotion();
  const counts = products.reduce<Record<string, number>>((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
  const cats = (Object.keys(CATEGORY_INFO) as Category[]).filter((c) => counts[c]);

  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const measure = () => {
      const on = mq.matches && !reduce;
      setPinned(on);
      if (on && track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    };
    measure();
    mq.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    return () => {
      mq.removeEventListener('change', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduce, cats.length]);

  // measure again once the pinned layout has rendered
  useEffect(() => {
    if (pinned && track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
  }, [pinned, lang]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const vel = useSpring(useVelocity(x), { stiffness: 120, damping: 30 });
  const lean = useTransform(vel, [-2500, 0, 2500], [14, 0, -14]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const intro = (
    <div className="flex w-[min(86vw,420px)] shrink-0 flex-col justify-center pr-4 lg:w-[400px]">
      <div className="eyebrow">{t({ mr: 'श्रेणी', en: 'Categories' })}</div>
      <h2 id="cat-title" className="h-section mt-3">
        <SplitWords text={t({ mr: 'तुमच्या पूजेसाठी काय हवे?', en: 'What does your puja need?' })} />
      </h2>
      <p className="lede mt-4">{t({ mr: 'अगरबत्तीपासून कापूर व वातींपर्यंत, सर्व एकाच ब्रँडकडून.', en: 'From agarbatti to camphor and wicks, all from one brand.' })}</p>
      <p className="mt-8 hidden items-center gap-3 text-[.85rem] text-mist/70 lg:flex">
        <span className="h-px w-10 bg-gold-light/60" /> {t({ mr: 'स्क्रोल करा, कार्ड सरकतील', en: 'Keep scrolling to slide' })}
      </p>
    </div>
  );

  const cards = cats.map((c, i) => {
    const info = CATEGORY_INFO[c];
    return (
      <motion.div key={c} style={pinned ? { rotateY: lean } : undefined} className="w-[78vw] shrink-0 snap-center sm:w-[340px] lg:w-[380px]">
        <Link
          href={`/products?c=${c}`}
          className="glow-border hover-glow group relative block aspect-[3/4] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)]"
        >
          <Image src={media(info.image)} alt={t(info.label)} fill sizes="(max-width: 1024px) 78vw, 380px" className="object-cover transition duration-[1.4s] ease-soft group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-wood-night via-wood-night/30 to-transparent" />
          <span className="absolute right-5 top-4 font-display text-[3.2rem] leading-none text-ivory/25 transition group-hover:text-gold-light/70">{pad(i + 1)}</span>
          <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[.75rem] font-semibold text-ivory backdrop-blur">
            {lang === 'mr' ? `${counts[c]} उत्पादने` : `${counts[c]} products`}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="font-display text-[1.7rem] leading-snug text-ivory">{t(info.label)}</h3>
            <p className="mt-1 line-clamp-2 text-[.9rem] text-mist">{t(info.blurb)}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron to-gold px-4 py-2 text-[.85rem] font-semibold text-wood-night transition duration-500 group-hover:gap-3">
              {t({ mr: 'पाहा', en: 'Browse' })} <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      </motion.div>
    );
  });

  return (
    <section
      ref={ref}
      className="on-dark relative bg-wood-night text-ivory"
      style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}
      aria-labelledby="cat-title"
    >
      <div className={pinned ? 'sticky top-0 flex h-screen items-center overflow-hidden' : 'relative overflow-hidden py-20'}>
        <Aurora tone="pink" />
        {pinned ? (
          <motion.div ref={track} style={{ x, perspective: 1200 }} className="relative flex items-center gap-7 pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-12">
            {intro}
            {cards}
          </motion.div>
        ) : (
          <div className="relative">
            <div className="wrap">{intro}</div>
            <div ref={track} className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6">
              {cards}
            </div>
          </div>
        )}
        {pinned && (
          <div className="absolute bottom-10 left-1/2 h-[3px] w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-saffron to-gold" />
          </div>
        )}
      </div>
    </section>
  );
}
