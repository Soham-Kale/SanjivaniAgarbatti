'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import AddToList from './cart/AddToList';
import { useLang } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/site';
import { useContent, useWa } from '@/lib/content-context';
import { media } from '@/lib/media';
import { rupees } from '@/lib/price';
import { hasModel } from '@/lib/models';
import { FRAGRANCE_NAMES } from '@/lib/fragrances';
import { SAFETY, howToUse } from '@/lib/usage';
import type { Product } from '@/lib/types';

const ProductViewer = dynamic(() => import('./3d/ProductViewer'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid place-items-center text-stone">3D…</div>,
});

const TYPE: Record<string, { mr: string; en: string }> = {
  pouch: { mr: 'पाऊच', en: 'Pouch' },
  packet: { mr: 'लांब पॅकेट', en: 'Long packet' },
  jar: { mr: 'जार', en: 'Jar' },
  box: { mr: 'बॉक्स', en: 'Box' },
  pack: { mr: 'पॅक', en: 'Pack' },
};

export default function ProductDetail({ p, related }: { p: Product; related: Product[] }) {
  const { t } = useLang();
  const { site } = useContent();
  const waLink = useWa();
  const images = [p.image, ...p.gallery];
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'photo' | '3d'>('photo');
  const [qty, setQty] = useState(1);
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const model = hasModel(p.slug);
  const steps = howToUse(p);

  const specs: [string, string][] = [
    [t({ mr: 'श्रेणी', en: 'Category' }), cat ? t(cat.label) : '—'],
    [t({ mr: 'पॅकिंग', en: 'Packing' }), TYPE[p.subtype] ? t(TYPE[p.subtype]) : '—'],
  ];
  if (p.fragrance && FRAGRANCE_NAMES[p.fragrance]) specs.push([t({ mr: 'सुगंध', en: 'Fragrance' }), t(FRAGRANCE_NAMES[p.fragrance])]);
  if (p.packSize && t(p.packSize)) specs.push([t({ mr: 'पॅक साइज', en: 'Pack size' }), t(p.packSize)]);
  if (typeof p.mrp === 'number') specs.push([t({ mr: 'MRP', en: 'MRP' }), rupees(p.mrp)]);
  if (p.priceNote) specs.push([t({ mr: 'पॅक / किंमत', en: 'Packs / price' }), t(p.priceNote)]);
  specs.push([t({ mr: 'उत्पादक', en: 'Made by' }), t({ mr: 'संजीवनी, माळेवाडी-अकलूज', en: 'Sanjivani, Malewadi-Akluj' })]);

  return (
    <div className="wrap py-10 md:py-14">
      <nav className="mb-8 text-[.88rem] text-stone" aria-label="breadcrumb">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/products" className="hover:text-wood">{t({ mr: 'उत्पादने', en: 'Products' })}</Link> /</li>
          {cat && <li><Link href={`/products?c=${p.category}`} className="hover:text-wood">{t(cat.label)}</Link> /</li>}
          <li aria-current="page" className="text-charcoal">{t(p.name)}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-gradient-to-b from-sand to-ivory-2 shadow-card">
            <AnimatePresence mode="wait">
              {mode === 'photo' ? (
                <motion.div key={images[active]} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                  <Image src={media(images[active])} alt={`${p.name.mr} (${p.name.en})`} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
                </motion.div>
              ) : (
                <motion.div key="3d" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProductViewer slug={p.slug} />
                  <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[.78rem] text-stone">
                    {t({ mr: 'फिरवण्यासाठी ओढा · 3D मॉडेल खऱ्या पॅकच्या फोटोवरून', en: 'Drag to rotate · 3D model made from the real pack photo' })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {model && (
              <div className="absolute left-3 top-3 flex rounded-full bg-ivory/90 p-1 text-[.82rem] font-semibold shadow-card backdrop-blur" role="group" aria-label={t({ mr: 'दृश्य', en: 'View' })}>
                {(['photo', '3d'] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className="relative min-h-[40px] rounded-full px-4 text-wood aria-pressed:text-ivory">
                    {mode === m && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-wood" />}
                    <span className="relative">{m === 'photo' ? t({ mr: 'फोटो', en: 'Photo' }) : t({ mr: '3D मध्ये पाहा', en: 'View in 3D' })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {images.length > 1 && mode === 'photo' && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setActive(i)} aria-label={t({ mr: `फोटो ${i + 1}`, en: `Photo ${i + 1}` })} aria-pressed={i === active} className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === active ? 'border-wood' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <Image src={media(src)} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <Reveal>
          <div className="eyebrow">{t(p.tagline)}</div>
          <h1 className="mt-3 text-[clamp(2.3rem,5vw,3.6rem)] text-wood">{p.name.mr}</h1>
          <p className="font-display text-[1.2rem] italic text-sandal">{p.name.en}</p>
          <p className="mt-6 text-[1.05rem] text-charcoal-soft">{t(p.description)}</p>

          {p.uses && (
            <div className="mt-6 rounded-2xl border-l-4 border-gold bg-sand/70 px-5 py-4">
              <h2 className="font-display text-[1.15rem] text-wood">{t({ mr: 'कशासाठी वापरतात?', en: 'What is it for?' })}</h2>
              <p className="mt-1 text-[.98rem] text-charcoal-soft">{t(p.uses)}</p>
            </div>
          )}

          {p.benefits.length > 0 && (
            <ul className="mt-6 grid gap-2.5">
              {p.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="card mt-8 p-5">
            {typeof p.price === 'number' && (
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[2rem] leading-none text-wood">{rupees(p.price)}</span>
                {typeof p.mrp === 'number' && p.mrp > p.price && (
                  <>
                    <s className="text-stone">{rupees(p.mrp)}</s>
                    <span className="rounded-full bg-maroon/10 px-2 py-0.5 text-[.8rem] font-semibold text-maroon">
                      {t({ mr: `${Math.round((1 - p.price / p.mrp) * 100)}% सूट`, en: `${Math.round((1 - p.price / p.mrp) * 100)}% off` })}
                    </span>
                  </>
                )}
                {p.packSize && t(p.packSize) && <span className="text-[.9rem] text-stone">/ {t(p.packSize)}</span>}
              </div>
            )}
            {p.inStock === false && <p className="mb-3 font-semibold text-maroon">{t({ mr: 'सध्या स्टॉक संपला आहे. उपलब्धतेसाठी WhatsApp वर विचारा.', en: 'Out of stock right now. Ask on WhatsApp for availability.' })}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-charcoal/15 bg-white/60">
                <button type="button" className="grid h-12 w-12 place-items-center text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t({ mr: 'कमी करा', en: 'Decrease' })}>−</button>
                <span className="w-10 text-center text-lg tabular-nums" aria-live="polite">{qty}</span>
                <button type="button" className="grid h-12 w-12 place-items-center text-lg" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label={t({ mr: 'वाढवा', en: 'Increase' })}>+</button>
              </div>
              <AddToList p={p} qty={qty} openOnAdd />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[.92rem]">
              <a className="btn-link" href={waLink(`नमस्कार, मला ${p.name.mr} (${qty}) ऑर्डर करायची आहे.`)} target="_blank" rel="noopener">{t({ mr: 'थेट WhatsApp वर विचारा', en: 'Ask on WhatsApp' })} ↗</a>
              <a className="btn-link" href={`tel:${site.phones[0]?.tel}`}>{t({ mr: 'कॉल करा', en: 'Call us' })}</a>
            </div>
            <p className="mt-4 text-[.82rem] text-stone">{typeof p.price === 'number' ? t({ mr: 'अंतिम किंमत व डिलिव्हरी ऑर्डरनंतर फोन / WhatsApp वर कळवली जाते.', en: 'Final price and delivery are confirmed by phone or WhatsApp after you order.' }) : t({ mr: 'किंमत, पॅक साइज व डिलिव्हरी ऑर्डरनंतर फोन / WhatsApp वर कळवली जाते.', en: 'Price, pack size and delivery are confirmed by phone or WhatsApp after you order.' })}</p>
          </div>

          {steps && (
            <section className="mt-8" aria-labelledby="howto-title">
              <h2 id="howto-title" className="font-display text-[1.35rem] text-wood">{t({ mr: 'वापर कसा करावा', en: 'How to use' })}</h2>
              <ol className="mt-3 grid gap-3">
                {steps.map((s, i) => (
                  <li key={s.en} className="flex gap-3.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-wood text-[.85rem] font-semibold text-gold-light">{i + 1}</span>
                    <span className="pt-0.5">{t(s)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[.85rem] text-stone">{t(SAFETY)}</p>
            </section>
          )}

          <dl className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3 text-[.95rem] sm:grid-cols-[140px_1fr]">
                <dt className="text-stone">{k}</dt>
                <dd className="text-charcoal">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[.9rem] text-stone">
            {t({ mr: 'दुकानदार / डीलर? ', en: 'Shop owner / dealer? ' })}
            <Link href="/contact#dealer" className="btn-link">{t({ mr: 'होलसेल दरासाठी चौकशी करा', en: 'Ask for wholesale rates' })}</Link>
          </p>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="rel-title">
          <h2 id="rel-title" className="h-section mb-8 !text-[clamp(1.8rem,3vw,2.4rem)]">{t({ mr: 'हेही पाहा', en: 'You may also like' })}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}><ProductCard p={r} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
