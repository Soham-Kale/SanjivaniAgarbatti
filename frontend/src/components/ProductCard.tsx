'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tilt from './Tilt';
import AddToList from './cart/AddToList';
import { useLang } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/site';
import { hasModel } from '@/lib/models';
import { media } from '@/lib/media';
import { rupees } from '@/lib/price';
import type { Product } from '@/lib/types';

export default function ProductCard({ p }: { p: Product }) {
  const { t } = useLang();
  const cat = CATEGORIES.find((c) => c.id === p.category);
  return (
    <Tilt className="glow-border hover-glow group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-charcoal/10 bg-white shadow-card transition-shadow duration-500 hover:shadow-lift">
      <Link href={`/products/${p.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative m-2 aspect-[4/5] overflow-hidden rounded-[20px] bg-sand">
          <Image
            src={media(p.image)}
            alt={`${p.name.mr} (${p.name.en})`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-[1.1s] ease-soft group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wood-night/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-full bg-white/90 px-3 py-1 text-[.75rem] font-semibold text-wood opacity-0 backdrop-blur transition duration-500 ease-soft group-hover:translate-y-0 group-hover:opacity-100">{t({ mr: 'जवळून पाहा', en: 'Quick look' })} →</span>
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-0.5 text-[.72rem] font-semibold text-wood backdrop-blur">{cat ? t(cat.label) : ''}</span>
          {hasModel(p.slug) && <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-saffron to-maroon px-2.5 py-0.5 text-[.68rem] font-bold tracking-wider text-white shadow-glow-sm">3D</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        <Link href={`/products/${p.slug}`} className="block">
          <h3 className="font-display text-[1.15rem] leading-snug text-wood sm:text-[1.3rem]">{t(p.name)}</h3>
          <p className="mt-0.5 text-[.75rem] uppercase tracking-[.1em] text-stone">{p.name.en}</p>
        </Link>
        {p.uses && <p className="mt-2 line-clamp-2 text-[.82rem] leading-relaxed text-charcoal-soft sm:line-clamp-3 sm:text-[.9rem]">{t(p.uses)}</p>}
        {typeof p.price === 'number' ? (
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-gradient-deep font-display text-[1.35rem]">{rupees(p.price)}</span>
            {typeof p.mrp === 'number' && p.mrp > p.price && <s className="text-[.82rem] text-stone">{rupees(p.mrp)}</s>}
            {p.packSize && t(p.packSize) && <span className="text-[.78rem] text-stone">/ {t(p.packSize)}</span>}
          </p>
        ) : (
          p.priceNote && <p className="mt-2 text-[.85rem] font-semibold text-sandal">{t(p.priceNote)}</p>
        )}
        {p.inStock === false && <p className="mt-1 text-[.78rem] font-semibold text-maroon">{t({ mr: 'सध्या स्टॉक संपला', en: 'Out of stock' })}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <Link href={`/products/${p.slug}`} className="text-[.85rem] font-semibold text-wood underline-offset-4 hover:underline">
            {t({ mr: 'पाहा', en: 'View' })} →
          </Link>
          <AddToList p={p} size="sm" />
        </div>
      </div>
    </Tilt>
  );
}
