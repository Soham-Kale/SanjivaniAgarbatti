'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

type Photo = { src: string; title: I18n; text: I18n; href?: string; wide?: boolean };

/** Every gallery photo carries a caption saying what it shows and what the product is for. */
const PHOTOS: Photo[] = [
  {
    src: '/images/gallery/shop.jpg',
    title: { mr: 'संजीवनी दुकान, माळेवाडी-अकलूज', en: 'Sanjivani shop, Malewadi-Akluj' },
    text: { mr: 'आमचे दुकान, जिथे स्वतः तयार केलेली अगरबत्ती, धूप व पूजा साहित्य घाऊक व किरकोळ मिळते.', en: 'Our shop, selling our own agarbatti, dhoop and puja items wholesale and retail.' },
    wide: true,
  },
  {
    src: '/images/gallery/cup-dhoop-open.jpg',
    title: { mr: 'प्रीमियम कप धूप', en: 'Premium cup dhoop' },
    text: { mr: 'बहुरंगी कप धूपचा बॉक्स. थेट पेटवून पूजा, आरती व होमासाठी; एक कप २ तासांपेक्षा जास्त जळतो.', en: 'A box of multicolour dhoop cups. Light one directly for puja, aarti or havan; each burns for over 2 hours.' },
    href: '/products/cup-dhoop',
  },
  {
    src: '/images/gallery/cup-dhoop-charcoal.jpg',
    title: { mr: 'कप धूप व कोळसा', en: 'Cup dhoop with charcoal' },
    text: { mr: 'कप धूपसोबत कोळशाचा रोल मिळतो.', en: 'Each cup dhoop pack comes with a charcoal roll.' },
    href: '/products/cup-dhoop',
  },
  {
    src: '/images/gallery/cup-dhoop-closeup.jpg',
    title: { mr: 'कप धूप, जवळून', en: 'Cup dhoop, close up' },
    text: { mr: 'हर्बल/मसाला मिश्रण भरलेले लहान कप. धूर जास्त असल्याने मंदिर, दुकान व मोठ्या जागेसाठी उपयुक्त.', en: 'Small cups filled with a herbal/masala mix. More smoke, so they suit temples, shops and larger rooms.' },
    href: '/products/cup-dhoop',
  },
  {
    src: '/images/gallery/premium-jar-mogra-2.jpg',
    title: { mr: 'मोगरा प्रीमियम जार', en: 'Mogra premium jar' },
    text: { mr: 'गोल्ड-कॅप जारमधील मोगरा अगरबत्ती. खास पूजा, सण व भेट देण्यासाठी.', en: 'Mogra agarbatti in a gold-cap jar, for special pujas, festivals and gifting.' },
    href: '/products/premium-mogra',
  },
  {
    src: '/images/products/premium-jar-chandan.jpg',
    title: { mr: 'चंदन प्रीमियम जार', en: 'Chandan premium jar' },
    text: { mr: 'सौम्य चंदन सुगंधाची प्रीमियम अगरबत्ती, ध्यान व पूजेच्या वेळी लावण्यासाठी.', en: 'Premium agarbatti with a mild sandalwood fragrance, for puja and quiet moments.' },
    href: '/products/premium-chandan',
  },
  {
    src: '/images/gallery/dhoop-jar-kewda-bel-pair.jpg',
    title: { mr: 'केवडा व बेल धूप जार', en: 'Kewda & Bel dhoop jars' },
    text: { mr: 'शिवपूजेसाठी विशेष केवडा व बेल सुगंधाची धूप कांडी.', en: 'Kewda and bel dhoop sticks, a favourite for Shiva puja.' },
    href: '/products/dhoop-jar-kewda-bel',
  },
  {
    src: '/images/gallery/dhoop-jar-rui-pair.jpg',
    title: { mr: 'रुई धूप जार', en: 'Rui dhoop jars' },
    text: { mr: 'रुई वनस्पतीपासून तयार पारंपरिक सुगंधाची धूप कांडी, शिवपूजेसाठी.', en: 'Dhoop sticks made from the rui (aak) plant, with a traditional fragrance for Shiva puja.' },
    href: '/products/dhoop-jar-rui',
  },
  {
    src: '/images/gallery/dhoop-jar-chandan-2.jpg',
    title: { mr: 'चंदन धूप जार', en: 'Chandan dhoop jar' },
    text: { mr: 'देवतेच्या चित्रासह जारमधील चंदन धूप कांडी, रोजची पूजा व आरतीसाठी.', en: 'Chandan dhoop sticks in a jar with a deity picture, for daily puja and aarti.' },
    href: '/products/dhoop-jar-chandan',
  },
  {
    src: '/images/products/dhoop-box-mogra.jpg',
    title: { mr: 'मोगरा धूप स्टिक बॉक्स', en: 'Mogra dhoop stick box' },
    text: { mr: 'श्री स्वामी समर्थांच्या चित्रासह मोगरा प्रीमियम धूप स्टिक बॉक्स.', en: 'Mogra premium dhoop sticks in a box with a Shri Swami Samarth picture.' },
    href: '/products/dhoop-box-mogra',
  },
  {
    src: '/images/gallery/dhoop-box-kewda-bel-2.jpg',
    title: { mr: 'केवडा व बेल धूप बॉक्स', en: 'Kewda & Bel dhoop box' },
    text: { mr: 'शिव-पार्वतीच्या चित्रासह केवडा व बेल धूप स्टिक बॉक्स.', en: 'Kewda and bel dhoop sticks in a box with a Shiva-Parvati picture.' },
    href: '/products/dhoop-box-kewda-bel',
  },
  {
    src: '/images/products/pouch-jaswand.jpg',
    title: { mr: 'जास्वंद अगरबत्ती पाऊच', en: 'Jaswand agarbatti pouch' },
    text: { mr: 'हलक्या, नैसर्गिक जास्वंद सुगंधाची रोजच्या पूजेसाठी अगरबत्ती.', en: 'Daily-puja agarbatti with a light hibiscus fragrance.' },
    href: '/products/pouch-jaswand',
  },
  {
    src: '/images/gallery/packet-denim-single.jpg',
    title: { mr: 'डेनिम अगरबत्ती पॅकेट', en: 'Denim agarbatti packet' },
    text: { mr: 'घर, ऑफिस व दुकानासाठी आधुनिक सुगंध, ₹५ पासूनच्या पॅकमध्ये.', en: 'A modern fragrance for home, office and shop, in packs from ₹5.' },
    href: '/products/packet-denim',
  },
  {
    src: '/images/gallery/phulvat-2.jpg',
    title: { mr: 'फुलवात', en: 'Phulvat' },
    text: { mr: 'दिवा व निरांजनात तेल/तूप घालून लावण्यासाठी कापसाची फुलवात.', en: 'Cotton flower wicks for a diya or niranjan with oil or ghee.' },
    href: '/products/phulvat',
  },
];

export default function Gallery() {
  const { t } = useLang();
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
  }, [open, close]);

  const cur = open === null ? null : PHOTOS[open];

  return (
    <section id="gallery" className="section wrap scroll-mt-16 pt-0">
      <SectionHead
        eyebrow={{ mr: 'गॅलरी', en: 'Gallery' }}
        title={{ mr: 'आमची उत्पादने, जवळून', en: 'Our products, up close' }}
        text={{ mr: 'प्रत्येक फोटोखाली ते उत्पादन काय आहे आणि कशासाठी वापरतात ते दिले आहे.', en: 'Each photo says what the product is and what it is used for.' }}
      />
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTOS.map((ph, i) => (
          <li key={ph.src} className={ph.wide ? 'sm:col-span-2 lg:col-span-2' : ''}>
            <figure className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-charcoal/10 bg-ivory-2 shadow-card">
              <button type="button" onClick={() => setOpen(i)} className={`relative block overflow-hidden bg-sand ${ph.wide ? 'aspect-[4/3] sm:aspect-[8/3]' : 'aspect-[4/3]'}`} aria-label={t({ mr: `मोठा फोटो: ${ph.title.mr}`, en: `Enlarge: ${ph.title.en}` })}>
                <Image src={ph.src} alt={t(ph.title)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 ease-soft group-hover:scale-[1.04]" />
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
