'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tilt from './Tilt';
import AddToList from './cart/AddToList';
import { useLang } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/site';
import { hasModel } from '@/lib/models';
import type { Product } from '@/lib/types';

export default function ProductCard({ p }: { p: Product }) {
  const { t } = useLang();
  const cat = CATEGORIES.find((c) => c.id === p.category);
  return (
    <Tilt className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-charcoal/10 bg-ivory-2 shadow-card transition-shadow duration-500 hover:shadow-lift">
      <Link href={`/products/${p.slug}`} className="block" aria-label={t(p.name)}>
        <div className="relative aspect-[4/5] overflow-hidden bg-sage">
          <Image
            src={p.image}
            alt={`${p.name.mr} (${p.name.en})`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-[1.1s] ease-soft group-hover:scale-[1.06]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-night/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-2.5 py-0.5 text-[.72rem] font-semibold text-forest backdrop-blur">{cat ? t(cat.label) : ''}</span>
          {hasModel(p.slug) && <span className="absolute right-3 top-3 rounded-full bg-forest/85 px-2 py-0.5 text-[.68rem] font-bold tracking-wider text-gold-light">3D</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/products/${p.slug}`} className="block">
          <h3 className="font-display text-[1.15rem] leading-snug text-forest sm:text-[1.3rem]">{t(p.name)}</h3>
          <p className="mt-0.5 text-[.75rem] uppercase tracking-[.1em] text-stone">{p.name.en}</p>
        </Link>
        {p.priceNote && <p className="mt-2 text-[.85rem] font-semibold text-sandal">{t(p.priceNote)}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <Link href={`/products/${p.slug}`} className="text-[.85rem] font-semibold text-forest underline-offset-4 hover:underline">
            {t({ mr: 'पाहा', en: 'View' })} →
          </Link>
          <AddToList p={p} size="sm" />
        </div>
      </div>
    </Tilt>
  );
}
