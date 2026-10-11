'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import SectionHead from './SectionHead';

const IMAGES = [
  { src: '/images/gallery/shop.jpg', alt: 'संजीवनी दुकान, माळेवाडी-अकलूज', big: true },
  { src: '/images/gallery/cup-dhoop-open.jpg', alt: 'प्रीमियम कप धूप' },
  { src: '/images/gallery/dhoop-jar-kewda-bel-pair.jpg', alt: 'केवडा व बेल धूप जार' },
  { src: '/images/products/dhoop-box-kewda-bel.jpg', alt: 'केवडा व बेल धूप बॉक्स' },
  { src: '/images/products/premium-jar-kasturi.jpg', alt: 'कस्तुरी प्रीमियम जार' },
  { src: '/images/gallery/dhoop-jar-rui-pair.jpg', alt: 'रुई धूप जार' },
  { src: '/images/products/packet-gulab.jpg', alt: 'गुलाब अगरबत्ती पॅकेट' },
  { src: '/images/gallery/phulvat-2.jpg', alt: 'फुलवात' },
  { src: '/images/gallery/cup-dhoop-charcoal.jpg', alt: 'कप धूप व कोळसा' },
];

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="gallery" className="section wrap scroll-mt-16 pt-0">
      <SectionHead eyebrow={{ mr: 'गॅलरी', en: 'Gallery' }} title={{ mr: 'आमचे दुकान, माळेवाडी-अकलूज', en: 'Our shop, Malewadi-Akluj' }} />
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-[2fr_1fr_1fr]">
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpen(i)}
            className={`relative overflow-hidden rounded-[14px] ${img.big ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}`}
            aria-label={img.alt}
          >
            <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover brightness-[.85] transition duration-300 hover:scale-105 hover:brightness-100" />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="relative h-[80vh] w-full max-w-3xl">
              <Image src={IMAGES[open].src} alt={IMAGES[open].alt} fill sizes="90vw" className="object-contain" />
            </motion.div>
            <button className="absolute right-5 top-5 text-2xl text-ivory" aria-label="बंद करा">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
