'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { useLang } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/site';
import { FRAGRANCE_NAMES } from '@/lib/fragrances';
import type { Category, Product } from '@/lib/types';

export default function ProductGrid({ products, initial = 'all' }: { products: Product[]; initial?: Category | 'all' }) {
  const { t } = useLang();
  const [cat, setCat] = useState<Category | 'all'>(initial);
  const [frag, setFrag] = useState('');

  const fragrances = useMemo(() => {
    const ids = new Set<string>();
    products.forEach((p) => (cat === 'all' || p.category === cat) && p.fragrance && ids.add(p.fragrance));
    return [...ids];
  }, [products, cat]);

  const list = useMemo(() => products.filter((p) => (cat === 'all' || p.category === cat) && (!frag || p.fragrance === frag)), [products, cat, frag]);

  return (
    <>
      <div className="sticky top-[72px] z-20 -mx-4 mb-8 border-b border-charcoal/10 bg-ivory/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t({ mr: 'श्रेणी', en: 'Category' })}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => {
                setCat(c.id);
                setFrag('');
              }}
              className="relative min-h-[44px] shrink-0 rounded-full px-4 text-[.92rem] font-medium text-stone transition-colors hover:text-forest aria-pressed:text-ivory"
            >
              {cat === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-forest" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative">{t(c.label)}</span>
            </button>
          ))}
        </div>
        {fragrances.length > 1 && (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-[.85rem]">
            <span className="shrink-0 text-stone">{t({ mr: 'सुगंध:', en: 'Fragrance:' })}</span>
            {['', ...fragrances].map((id) => (
              <button
                key={id || 'all'}
                type="button"
                aria-pressed={frag === id}
                onClick={() => setFrag(id)}
                className="min-h-[36px] shrink-0 rounded-full border border-charcoal/15 px-3 text-charcoal-soft transition hover:border-forest aria-pressed:border-gold aria-pressed:bg-gold/15 aria-pressed:text-forest"
              >
                {id ? t(FRAGRANCE_NAMES[id] ?? { mr: id, en: id }) : t({ mr: 'सर्व', en: 'All' })}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mb-5 text-[.9rem] text-stone" aria-live="polite">
        {t({ mr: `${list.length} उत्पादने`, en: `${list.length} products` })}
      </p>
      <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.04, duration: 0.5 } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            >
              <ProductCard p={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && (
        <div className="card mt-6 p-10 text-center">
          <p className="text-stone">{t({ mr: 'या निवडीत उत्पादन नाही.', en: 'No products in this selection.' })}</p>
          <button type="button" className="btn-outline mt-4" onClick={() => { setCat('all'); setFrag(''); }}>
            {t({ mr: 'सर्व उत्पादने दाखवा', en: 'Show all products' })}
          </button>
        </div>
      )}
    </>
  );
}
