'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function FranchiseInfo() {
  const { t } = useLang();
  const { franchise } = useContent();
  const BLOCKS = franchise.blocks;
  const FAQ = franchise.faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="wrap pb-24">
      <div className="grid gap-6 md:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <Reveal key={i} delay={i * 0.1} className="card p-7">
            <h3 className="mb-4 text-[1.35rem] text-wood">{t(b.title)}</h3>
            <ul className="grid gap-2 text-[.95rem] text-charcoal-soft">
              {b.items.map((it, k) => (
                <li key={k}>
                  <span className="mr-2 text-gold-deep">✦</span>
                  {t(it)}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <h2 className="h-section mb-6 mt-20">{t({ mr: 'नेहमीचे प्रश्न', en: 'Frequently asked questions' })}</h2>
      <div className="divide-y divide-charcoal/10 rounded-[18px] border border-charcoal/10">
        {FAQ.map((f, i) => (
          <div key={i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-[1.15rem]"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {t(f.q)}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-gold-deep">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-6 pb-5 text-stone">{t(f.a)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
