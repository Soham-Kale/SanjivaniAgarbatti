'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

const ShowcaseScene = dynamic(() => import('../3d/ShowcaseScene'), { ssr: false });

const STEPS: { slug: string; k: I18n; h: I18n; p: I18n; href: string }[] = [
  {
    slug: 'premium-mogra',
    k: { mr: 'प्रीमियम अगरबत्ती', en: 'Premium agarbatti' },
    h: { mr: 'मोगरा, गोल्ड-कॅप जारमध्ये', en: 'Mogra, in a gold-cap jar' },
    p: { mr: 'गोड व मोहक मोगऱ्याचा सुगंध. सुंदर जार, भेट देण्यासाठीही उत्तम.', en: 'Sweet, graceful jasmine. A handsome jar that also makes a good gift.' },
    href: '/products/premium-mogra',
  },
  {
    slug: 'dhoop-box-chandan',
    k: { mr: 'प्रीमियम धूप स्टिक', en: 'Premium dhoop sticks' },
    h: { mr: 'चंदन धूप, बॉक्स पॅक', en: 'Chandan dhoop, boxed' },
    p: { mr: 'सौम्य व थंडावा देणारा चंदनाचा सुगंध, रोजच्या पूजेसाठी.', en: 'A soft, cooling sandalwood fragrance for daily puja.' },
    href: '/products/dhoop-box-chandan',
  },
  {
    slug: 'pouch-gulab',
    k: { mr: 'दैनंदिन अगरबत्ती', en: 'Daily agarbatti' },
    h: { mr: 'गुलाब, रोजच्या पूजेसाठी', en: 'Rose, for every day' },
    p: { mr: 'प्रसन्न व गोड गुलाबाचा सुगंध, सोयीच्या पाऊचमध्ये.', en: 'A cheerful, sweet rose fragrance in a handy pouch.' },
    href: '/products/pouch-gulab',
  },
];

/** Sticky, scroll-driven 3D showcase of three real packs. */
export default function Showcase() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(STEPS.length - 1, Math.round(v * (STEPS.length - 1)))));
  const s = STEPS[i];

  return (
    <section ref={ref} className="on-dark relative bg-forest-deep text-ivory" style={{ height: `${STEPS.length * 85 + 30}vh` }} aria-label={t({ mr: '3D उत्पादन दर्शन', en: '3D product showcase' })}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_35%_55%,rgba(201,154,69,.25),transparent_70%)]" />
        <div className="wrap relative grid flex-1 items-center gap-4 pt-20 lg:grid-cols-[1.2fr_1fr] lg:pt-0">
          <div className="relative h-[46svh] lg:h-[78svh]">
            <ShowcaseScene slugs={STEPS.map((x) => x.slug)} progress={scrollYProgress} />
          </div>
          <div className="relative pb-10 lg:pb-0">
            <div className="eyebrow">{t({ mr: 'जवळून पाहा', en: 'Up close' })}</div>
            <AnimatePresence mode="wait">
              <motion.div key={s.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <p className="mt-4 text-[.85rem] font-semibold uppercase tracking-[.14em] text-gold-light">{t(s.k)}</p>
                <h2 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] text-ivory">{t(s.h)}</h2>
                <p className="mt-3 max-w-md text-mist">{t(s.p)}</p>
                <Link href={s.href} className="btn-outline-light mt-6">{t({ mr: 'उत्पादन पाहा', en: 'View product' })} →</Link>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex gap-2" aria-hidden>
              {STEPS.map((x, k) => (
                <span key={x.slug} className={`h-1 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-gold' : 'w-4 bg-ivory/25'}`} />
              ))}
            </div>
            <p className="mt-4 text-[.78rem] text-mist/60">{t({ mr: '3D मॉडेल खऱ्या पॅकच्या फोटोवरून तयार केले आहेत.', en: '3D models are built from photos of the real packs.' })}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
