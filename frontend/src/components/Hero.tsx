'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const IncenseScene = dynamic(() => import('./IncenseScene'), { ssr: false });

export default function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="relative flex min-h-[600px] items-center overflow-hidden bg-hero-glow md:min-h-[640px]">
      <IncenseScene />
      <div className="wrap relative z-[2]">
        <div className="max-w-[560px] pb-[260px] pt-10 md:py-20">
          <motion.div className="eyebrow" {...item(0)}>
            {t({ mr: 'संजीवनी धूप आणि अगरबत्ती · अकलूज', en: 'Sanjivani Dhoop & Agarbatti · Akluj' })}
          </motion.div>
          <motion.h1 className="mt-4 text-[clamp(2.6rem,6vw,4.6rem)] text-ivory" {...item(1)}>
            {t({ mr: 'प्रार्थनेचा', en: 'The' })}{' '}
            <em className="not-italic text-gold">{t({ mr: 'पवित्र', en: 'sacred' })}</em>{' '}
            {t({ mr: 'सुगंध', en: 'fragrance of prayer' })}
          </motion.h1>
          <motion.div className="mb-[26px] mt-3.5 font-display text-[1.15rem] italic text-muted" {...item(2)}>
            Bringing Divine Fragrance to Every Home
          </motion.div>
          <motion.p className="max-w-[46ch] text-[#cfc2ae]" {...item(3)}>
            {t({
              mr: 'प्रीमियम अगरबत्ती, धूप कांडी, कप धूप आणि संपूर्ण पूजा साहित्य. माळेवाडी-अकलूज येथे स्वतः तयार केलेले, घाऊक व किरकोळ दोन्ही.',
              en: 'Premium agarbatti, dhoop sticks, cup dhoop and complete puja sahitya. Made by us in Malewadi-Akluj, for wholesale and retail.',
            })}
          </motion.p>
          <motion.div className="mt-7 flex flex-wrap gap-3" {...item(4)}>
            <Link className="btn-solid" href="/products">{t({ mr: 'उत्पादने पाहा', en: 'View products' })}</Link>
            <Link className="btn-ghost" href="/franchise">{t({ mr: 'फ्रँचायझी घ्या →', en: 'Get a franchise →' })}</Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
