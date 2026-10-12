'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHead from '../SectionHead';
import { rise, stagger } from '../Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';
import type { Category, Product } from '@/lib/types';

/** Category cards (photo above, text below) for the categories that exist in the product data. */
export default function CategoryDiscovery({ products }: { products: Product[] }) {
  const { t, lang } = useLang();
  const { categories: CATEGORY_INFO } = useContent();
  const counts = products.reduce<Record<string, number>>((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
  const cats = (Object.keys(CATEGORY_INFO) as Category[]).filter((c) => counts[c]);

  return (
    <section className="section bg-sand/60" aria-labelledby="cat-title">
      <div className="wrap">
        <SectionHead
          eyebrow={{ mr: 'श्रेणी', en: 'Categories' }}
          title={{ mr: 'तुमच्या पूजेसाठी काय हवे?', en: 'What does your puja need?' }}
          text={{ mr: 'अगरबत्तीपासून कापूर व वातींपर्यंत, सर्व एकाच ब्रँडकडून.', en: 'From agarbatti to camphor and wicks, all from one brand.' }}
        />
        <motion.ul
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {cats.map((c, i) => {
            const info = CATEGORY_INFO[c];
            return (
              <motion.li key={c} variants={rise} className={i === 0 ? 'col-span-2 md:col-span-1' : ''}>
                <Link
                  href={`/products?c=${c}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-charcoal/10 bg-ivory shadow-card transition duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className={`relative overflow-hidden bg-sand ${i === 0 ? 'aspect-[16/10] md:aspect-[4/5]' : 'aspect-[4/5]'}`}>
                    <Image src={media(info.image)} alt={t(info.label)} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px" className="object-cover transition duration-[1.2s] ease-soft group-hover:scale-[1.06]" />
                    <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-2.5 py-0.5 text-[.72rem] font-semibold text-maroon backdrop-blur">
                      {lang === 'mr' ? `${counts[c]} उत्पादने` : `${counts[c]} products`}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-[1.15rem] leading-snug text-wood sm:text-[1.25rem]">{t(info.label)}</h3>
                    <p className="mt-1 text-[.85rem] leading-relaxed text-stone">{t(info.blurb)}</p>
                    <span className="mt-auto pt-3 text-[.85rem] font-semibold text-wood transition group-hover:text-maroon">
                      {t({ mr: 'पाहा', en: 'Browse' })} →
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
