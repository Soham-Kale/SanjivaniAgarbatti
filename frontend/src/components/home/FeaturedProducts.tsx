'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHead from '../SectionHead';
import ProductCard from '../ProductCard';
import { rise, stagger } from '../Reveal';
import { useLang } from '@/lib/i18n';
import type { Product } from '@/lib/types';

export default function FeaturedProducts({ products, total }: { products: Product[]; total: number }) {
  const { t } = useLang();
  return (
    <section className="section wrap" aria-labelledby="featured-title">
      <SectionHead
        eyebrow={{ mr: 'निवडक उत्पादने', en: 'Featured' }}
        title={{ mr: 'प्रत्येक पूजेसाठी, एकाच ठिकाणी', en: 'For every puja, in one place' }}
        text={{ mr: 'रंग हाताला लागत नाही, कमी धूर आणि दीर्घकाळ टिकणारा सौम्य सुगंध.', en: 'Colour does not stick to hands, low smoke and a mild, long-lasting fragrance.' }}
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
