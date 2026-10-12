'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHead from '../SectionHead';
import ProductCard from '../ProductCard';
import { rise, stagger } from '../Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import type { Product } from '@/lib/types';

export default function FeaturedProducts({ products, total }: { products: Product[]; total: number }) {
  const { t } = useLang();
  const { featured } = useContent();
  return (
    <section className="section wrap" aria-labelledby="featured-title">
      <SectionHead
        eyebrow={featured.eyebrow}
        title={featured.title}
        text={featured.text}
      />
      <motion.ul
        className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {products.map((p) => (
          <motion.li key={p.slug} variants={rise}>
            <ProductCard p={p} />
          </motion.li>
        ))}
      </motion.ul>
      <div className="mt-12 text-center">
        <Link href="/products" className="btn-outline">
          {t({ mr: `सर्व ${total} उत्पादने पाहा`, en: `See all ${total} products` })} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
