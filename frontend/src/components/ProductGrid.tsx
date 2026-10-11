'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { useLang } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/site';
import { FRAGRANCE_NAMES } from '@/lib/fragrances';
import type { Category, Product } from '@/lib/types';

export default function ProductGrid({
  products,
  initial = 'all',
  limit,
  showFragranceFilter = false,
}: {
  products: Product[];
  initial?: Category | 'all';
  limit?: number;
  showFragranceFilter?: boolean;
}) {
  const { t } = useLang();
  const [cat, setCat] = useState<Category | 'all'>(initial);
  const [frag, setFrag] = useState<string>('');

  const fragrances = useMemo(() => {
    const ids = new Set<string>();
    products.forEach((p) => p.fragrance && ids.add(p.fragrance));
    return [...ids];
  }, [products]);

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === 'all' || p.category === cat) && (!frag || p.fragrance === frag));
    if (limit && cat === 'all' && !frag) l = l.filter((p) => p.featured);
    return limit ? l.slice(0, limit) : l;
  }, [products, cat, frag, limit]);

  return (
    <>
      <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="श्रेणी">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={cat === c.id}
            onClick={() => setCat(c.id)}
            className="rounded-full border border-line px-4 py-2 text-[.92rem] text-muted transition-colors hover:text-ivory aria-pressed:border-gold aria-pressed:bg-gold aria-pressed:text-[#1a1209]"
          >
            {t(c.label)}
          </button>
        ))}
      </div>
      {showFragranceFilter && (
        <div className="-mt-3 mb-7 flex flex-wrap items-center gap-2 text-[.85rem]">
          <span className="text-muted">{t({ mr: 'सुगंध:', en: 'Fragrance:' })}</span>
          <button type="button" onClick={() => setFrag('')} className={`rounded-full px-3 py-1 ${!frag ? 'text-gold' : 'text-muted'}`}>
            {t({ mr: 'सर्व', en: 'All' })}
          </button>
          {fragrances.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFrag(id === frag ? '' : id)}
              className={`rounded-full border px-3 py-1 ${frag === id ? 'border-gold text-gold' : 'border-line text-muted hover:text-ivory'}`}
            >
              {FRAGRANCE_NAMES[id] ? t(FRAGRANCE_NAMES[id]) : id}
            </button>
          ))}
        </div>
      )}
      <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
            >
              <ProductCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="text-muted">{t({ mr: 'या निवडीत उत्पादन नाही.', en: 'No products in this selection.' })}</p>}
    </>
  );
}
