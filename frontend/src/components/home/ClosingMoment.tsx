'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Aurora from '../fx/Aurora';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { useNearMount } from '@/lib/use-mount-3d';

const DiyaScene = dynamic(() => import('../3d/DiyaScene'), { ssr: false });

export default function ClosingMoment() {
  const { t } = useLang();
  const { closing } = useContent();
  const { ref, near } = useNearMount<HTMLElement>();
  return (
    <section ref={ref} className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-wood-night text-center text-ivory">
      <Aurora tone="warm" />
      {near && <DiyaScene />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-wood-night to-transparent" />
      <div className="wrap relative pt-24 md:pt-32">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow justify-center">
          {t(closing.eyebrow)}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-4xl text-[clamp(2.5rem,6.4vw,5.2rem)] leading-[1.2] text-ivory"
        >
          {t(closing.title)} <span className="text-gradient">{t(closing.highlight)}</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="mx-auto mt-5 max-w-lg text-mist">
          {t(closing.text)}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.8 }} className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-gold px-8">{t({ mr: 'उत्पादने पाहा', en: 'Explore Products' })} →</Link>
          <Link href="/contact" className="btn-outline-light px-8">{t({ mr: 'संपर्क करा', en: 'Contact us' })}</Link>
        </motion.div>
      </div>
    </section>
  );
}
