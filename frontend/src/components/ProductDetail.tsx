'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { CATEGORIES, SITE, waLink } from '@/lib/site';
import type { Product } from '@/lib/types';

export default function ProductDetail({ p, related }: { p: Product; related: Product[] }) {
  const { t } = useLang();
  const images = [p.image, ...p.gallery];
  const [active, setActive] = useState(0);
  const cat = CATEGORIES.find((c) => c.id === p.category);

  return (
    <div className="wrap py-14">
      <nav className="mb-8 text-[.85rem] text-muted" aria-label="breadcrumb">
        <Link href="/products" className="hover:text-ivory">{t({ mr: 'उत्पादने', en: 'Products' })}</Link>
        {cat && (
          <>
            {' / '}
            <Link href={`/products?c=${p.category}`} className="hover:text-ivory">{t(cat.label)}</Link>
          </>
        )}
        {' / '}
        <span className="text-ivory">{t(p.name)}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[200px_200px_18px_18px] border border-gold-soft bg-black shadow-ember">
            <AnimatePresence mode="wait">
              <motion.div key={images[active]} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <Image src={images[active]} alt={p.name.mr} fill priority sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`फोटो ${i + 1}`}
                  className={`relative h-20 w-16 overflow-hidden rounded-lg border ${i === active ? 'border-gold' : 'border-line opacity-70'}`}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <Reveal>
          <div className="eyebrow">{t(p.tagline)}</div>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.4rem)] text-gold">{p.name.mr}</h1>
          <div className="font-display text-[1.1rem] italic text-muted">{p.name.en}</div>
          <p className="mt-6 text-sand">{t(p.description)}</p>
          {p.priceNote && (
            <p className="mt-4">
              <span className="text-muted">{t({ mr: 'पॅक:', en: 'Packs:' })}</span>{' '}
              <b className="font-display text-gold">{t(p.priceNote)}</b>
            </p>
          )}
          {p.benefits.length > 0 && (
            <ul className="mt-6 grid gap-2">
              {p.benefits.map((b) => (
                <li key={b}>
                  <span className="mr-2 text-gold">✦</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-solid" href={waLink(`नमस्कार, मला ${p.name.mr} ऑर्डर करायची आहे.`)} target="_blank" rel="noopener">
              {t({ mr: 'WhatsApp वर ऑर्डर करा', en: 'Order on WhatsApp' })}
            </a>
            <a className="btn-ghost" href={`tel:${SITE.phones[0].tel}`}>
              {t({ mr: 'कॉल करा', en: 'Call us' })}
            </a>
          </div>
          <p className="mt-6 text-[.85rem] text-muted">
            {t({ mr: 'दुकानदार / डीलर? ', en: 'Shop owner / dealer? ' })}
            <Link href="/contact#dealer" className="text-gold underline">
              {t({ mr: 'होलसेल दरासाठी चौकशी करा', en: 'Ask for wholesale rates' })}
            </Link>
          </p>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-[2rem]">{t({ mr: 'हेही पाहा', en: 'You may also like' })}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
