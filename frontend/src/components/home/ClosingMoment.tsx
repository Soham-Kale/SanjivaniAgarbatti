'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

/** Soft SVG smoke wisps behind the closing line; pure CSS/SVG so no extra WebGL context. */
function Wisps() {
  const reduce = useReducedMotion();
  const paths = [
    'M200 400 C 160 320, 260 280, 210 200 S 180 80, 240 0',
    'M600 400 C 640 330, 540 270, 610 190 S 650 70, 580 0',
    'M1000 400 C 960 320, 1060 260, 1000 180 S 960 60, 1040 0',
  ];
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
      <defs>
        <filter id="blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#E2BE78"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#blur)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: [0, 0.8, 0.5] }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 3.5, delay: i * 0.4, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

export default function ClosingMoment() {
  const { t } = useLang();
  return (
    <section className="on-dark relative overflow-hidden bg-forest-deep py-28 text-center text-ivory md:py-36">
      <Wisps />
      <div className="wrap relative">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow justify-center">
          {t({ mr: 'संजीवनी', en: 'Sanjivani' })}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.25] text-ivory"
        >
          आपल्या प्रत्येक पूजेसाठी… <span className="italic text-gold-light">संजीवनी सोबत!</span>
        </motion.h2>
        <p className="mx-auto mt-5 max-w-lg text-mist">{t({ mr: 'तुमची ऑर्डर यादी बनवा आणि WhatsApp वर पाठवा. आम्ही किंमत व डिलिव्हरी कळवू.', en: 'Build your order list and send it on WhatsApp. We will confirm price and delivery.' })}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-gold">{t({ mr: 'उत्पादने पाहा', en: 'Explore Products' })} →</Link>
          <Link href="/contact" className="btn-outline-light">{t({ mr: 'संपर्क करा', en: 'Contact us' })}</Link>
        </div>
      </div>
    </section>
  );
}
