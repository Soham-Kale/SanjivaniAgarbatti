'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';
import { FRANCHISE_FAQ } from '@/lib/faq';

const BLOCKS: { title: I18n; items: I18n[] }[] = [
  {
    title: { mr: 'आमच्याकडून सहाय्य', en: 'Support from us' },
    items: [
      { mr: 'संजीवनी ब्रँड नाव व बोर्ड', en: 'Sanjivani brand name and board' },
      { mr: 'नियमित माल पुरवठा', en: 'Regular stock supply' },
      { mr: 'दुकान सेटअप मार्गदर्शन', en: 'Shop setup guidance' },
      { mr: 'उत्पादन व विक्री प्रशिक्षण', en: 'Product and sales training' },
      { mr: 'पोस्टर, बॅनर व सोशल मीडिया मार्केटिंग सहाय्य', en: 'Posters, banners and social media support' },
    ],
  },
  {
    title: { mr: 'योग्य ठिकाणे', en: 'Ideal locations' },
    items: [
      { mr: 'मंदिर परिसर', en: 'Near temples' },
      { mr: 'बाजारपेठ व मुख्य रस्ता', en: 'Market areas and main roads' },
      { mr: 'तालुका व जिल्हा ठिकाणे', en: 'Taluka and district towns' },
      { mr: 'मोठी गावे', en: 'Large villages' },
    ],
  },
  {
    title: { mr: 'कोण अर्ज करू शकतो?', en: 'Who can apply?' },
    items: [
      { mr: 'नवीन व्यवसाय सुरू करू इच्छिणारे युवक-युवती', en: 'Young people starting a business' },
      { mr: 'महिला उद्योजिका व बचत गट', en: 'Women entrepreneurs and self-help groups' },
      { mr: 'सध्याचे किराणा / पूजा साहित्य दुकानदार', en: 'Existing kirana / puja shop owners' },
      { mr: 'वितरक व होलसेलर', en: 'Distributors and wholesalers' },
    ],
  },
];

const FAQ = FRANCHISE_FAQ;

export default function FranchiseInfo() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="wrap pb-24">
      <div className="grid gap-6 md:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <Reveal key={b.title.mr} delay={i * 0.1} className="card p-7">
            <h3 className="mb-4 text-[1.35rem] text-wood">{t(b.title)}</h3>
            <ul className="grid gap-2 text-[.95rem] text-charcoal-soft">
              {b.items.map((it) => (
                <li key={it.mr}>
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
          <div key={f.q.mr}>
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
