'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SectionHead from '../SectionHead';
import ProductCard from '../ProductCard';
import { rise, stagger } from '../Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import type { Product } from '@/lib/types';

export default function FeaturedProducts({ products, total }: { products: Product[]; total: number }) {
  const { t } = useLang();
  const { featured } = useContent();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['8%', '-28%']);
  const orbY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -160]);

  return (
    <section ref={ref} className="section relative overflow-hidden" aria-labelledby="featured-title">
      {/* giant outlined word drifting sideways with the scroll */}
      <motion.div aria-hidden style={{ x }} className="text-outline-dark pointer-events-none absolute left-0 top-10 whitespace-nowrap font-display text-[clamp(7rem,18vw,17rem)] leading-none">
        संजीवनी · सुगंध · संजीवनी
      </motion.div>
      <motion.div aria-hidden style={{ y: orbY }} className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-saffron/20 blur-[100px]" />
      <motion.div aria-hidden style={{ y: orbY }} className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-lotus/25 blur-[100px]" />

      <div className="wrap relative">
        <SectionHead eyebrow={featured.eyebrow} title={featured.title} text={featured.text} />
        <motion.ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {products.map((p) => (
            <motion.li key={p.slug} variants={rise}>
              <ProductCard p={p} />
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-14 text-center">
          <Link href="/products" className="btn-primary px-8">
            {t({ mr: `सर्व ${total} उत्पादने पाहा`, en: `See all ${total} products` })} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
