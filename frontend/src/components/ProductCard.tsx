'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tilt from './Tilt';
import { useLang } from '@/lib/i18n';
import { CATEGORIES, waLink } from '@/lib/site';
import type { Product } from '@/lib/types';

export default function ProductCard({ p }: { p: Product }) {
  const { t } = useLang();
  const cat = CATEGORIES.find((c) => c.id === p.category);
  return (
    <Tilt className="card-surface group relative h-full p-3.5 transition-shadow duration-300 hover:shadow-lift">
      <Link href={`/products/${p.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
          <Image
            src={p.image}
            alt={p.name.mr}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </div>
        <h3 className="mt-3.5 text-[1.25rem]">{t(p.name)}</h3>
        <div className="text-[.8rem] uppercase tracking-[.08em] text-muted">{p.name.en}</div>
      </Link>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="rounded-full border border-line px-2.5 py-0.5 text-[.75rem] text-gold">{cat ? t(cat.label) : ''}</span>
        <a
          className="text-[.85rem] text-ivory opacity-80 hover:text-gold hover:opacity-100"
          href={waLink(`ऑर्डर: ${p.name.mr}`)}
          target="_blank"
          rel="noopener"
        >
          {t({ mr: 'WhatsApp ऑर्डर →', en: 'Order on WhatsApp →' })}
        </a>
      </div>
    </Tilt>
  );
}
