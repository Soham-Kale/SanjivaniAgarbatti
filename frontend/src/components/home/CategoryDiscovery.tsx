'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHead from '../SectionHead';
import { rise, stagger } from '../Reveal';
import { useLang } from '@/lib/i18n';
import { CATEGORY_INFO } from '@/lib/site';
import type { Category, Product } from '@/lib/types';

/** Editorial bento of the categories that actually exist in the product data. */
export default function CategoryDiscovery({ products }: { products: Product[] }) {
  const { t, lang } = useLang();
  const counts = products.reduce<Record<string, number>>((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
  const cats = (Object.keys(CATEGORY_INFO) as Category[]).filter((c) => counts[c]);

  return (
    <section className="section bg-sage/60" aria-labelledby="cat-title">
      <div className="wrap">
        <SectionHead
          eyebrow={{ mr: 'श्रेणी', en: 'Categories' }}
          title={{ mr: 'तुमच्या पूजेसाठी काय हवे?', en: 'What does your puja need?' }}
          text={{ mr: 'अगरबत्तीपासून कापूर व वातींपर्यंत, सर्व एकाच ब्रँडकडून.', en: 'From agarbatti to camphor and wicks, all from one brand.' }}
        />
        <motion.ul
          className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:gap-5 md:auto-rows-[230px] md:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {cats.map((c, i) => {
            const info = CATEGORY_INFO[c];
            return (
              <motion.li key={c} variants={rise} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <Link href={`/products?c=${c}`} className="group relative block h-full overflow-hidden rounded-[22px] bg-forest">
                  <Image src={info.image} alt="" fill sizes="(max-width: 768px) 50vw, 40vw" className="object-cover opacity-90 transition duration-[1.2s] ease-soft group-hover:scale-[1.06] group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-night/90 via-forest-night/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <span className="text-[.75rem] font-semibold uppercase tracking-[.14em] text-gold-light">
                      {lang === 'mr' ? `${counts[c]} उत्पादने` : `${counts[c]} products`}
                    </span>
                    <h3 className={`mt-1 text-ivory ${i === 0 ? 'text-[clamp(1.6rem,3vw,2.4rem)]' : 'text-[1.25rem] sm:text-[1.45rem]'}`}>{t(info.label)}</h3>
                    <p className={`text-[.9rem] text-mist ${i === 0 ? 'block' : 'hidden sm:block'}`}>{t(info.blurb)}</p>
                  </div>
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-forest opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden>
                    →
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
