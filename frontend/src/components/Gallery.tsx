'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function Gallery() {
  const { t } = useLang();
  const { gallery } = useContent();
  const PHOTOS = gallery.photos;
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % PHOTOS.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, PHOTOS.length]);

  const cur = open === null ? null : PHOTOS[open];

  return (
    <section id="gallery" className="section wrap scroll-mt-16 pt-0">
      <SectionHead
        eyebrow={gallery.eyebrow}
        title={gallery.title}
        text={gallery.text}
      />
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTOS.map((ph, i) => (
          <li key={`${i}-${ph.src}`} className={ph.wide ? 'sm:col-span-2 lg:col-span-2' : ''}>
            <figure className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-charcoal/10 bg-ivory-2 shadow-card">
              <button type="button" onClick={() => setOpen(i)} className={`relative block overflow-hidden bg-sand ${ph.wide ? 'aspect-[4/3] sm:aspect-[8/3]' : 'aspect-[4/3]'}`} aria-label={t({ mr: `मोठा फोटो: ${ph.title.mr}`, en: `Enlarge: ${ph.title.en}` })}>
                <Image src={ph.src} alt={t(ph.title)} fill sizes={ph.wide ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'} className={`object-cover transition duration-700 ease-soft group-hover:scale-[1.04] ${ph.wide ? 'object-top' : ''}`} />
              </button>
              <figcaption className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-display text-[1.15rem] text-wood">{t(ph.title)}</h3>
                <p className="mt-1 text-[.92rem] leading-relaxed text-charcoal-soft">{t(ph.text)}</p>
                {ph.href && (
                  <Link href={ph.href} className="btn-link mt-auto pt-3 text-[.9rem]">
                    {t({ mr: 'उत्पादन पाहा', en: 'View product' })} →
                  </Link>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {cur && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-wood-night/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={t(cur.title)}
          >
            <motion.div key={cur.src} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-[68vh] w-full max-w-3xl">
              <Image src={cur.src} alt={t(cur.title)} fill sizes="90vw" className="object-contain" />
            </motion.div>
            <div className="max-w-2xl text-center text-ivory" onClick={(e) => e.stopPropagation()}>
              <p className="font-display text-[1.25rem]">{t(cur.title)}</p>
              <p className="text-[.95rem] text-mist">{t(cur.text)}</p>
            </div>
            <button type="button" onClick={close} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ivory/10 text-xl text-ivory hover:bg-ivory/20" aria-label={t({ mr: 'बंद करा', en: 'Close' })}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
