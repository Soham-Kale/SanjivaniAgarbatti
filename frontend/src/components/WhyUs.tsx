'use client';

import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';

const ITEMS = [
  { b: { mr: 'उत्तम दर्जाचा कच्चा माल', en: 'Quality raw material' }, s: { mr: 'अगरबत्तीच्या गुणवत्तेसाठी निवडक कच्च्या मालाचा वापर.', en: 'Carefully chosen raw material for every stick.' } },
  { b: { mr: 'दीर्घकाळ टिकणारा सुगंध', en: 'Long-lasting fragrance' }, s: { mr: 'घर, दुकान, ऑफिस आणि मंदिरात प्रसन्न वातावरण.', en: 'A pleasant atmosphere at home, shop, office and temple.' } },
  { b: { mr: 'चांगली Burning Quality', en: 'Good burning quality' }, s: { mr: 'व्यवस्थित आणि सातत्याने जळणारी अगरबत्ती.', en: 'Burns evenly and steadily.' } },
  { b: { mr: 'किफायतशीर किंमत', en: 'Affordable prices' }, s: { mr: '₹५ पासून पॅक, प्रत्येक घरासाठी परवडणारे.', en: 'Packs from ₹5, affordable for every home.' } },
  { b: { mr: 'Wholesale व Retail', en: 'Wholesale & retail' }, s: { mr: 'दुकानदार, डीलर आणि ग्राहक सर्वांसाठी योग्य रेंज.', en: 'The right range for shops, dealers and customers.' } },
  { b: { mr: 'आकर्षक Packaging', en: 'Attractive packaging' }, s: { mr: 'ग्राहकांचे लक्ष वेधून घेणारे आणि विक्रीसाठी सोयीचे.', en: 'Eye-catching and easy to sell.' } },
];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section className="section wrap">
      <SectionHead eyebrow={{ mr: 'आम्हीच का?', en: 'Why us?' }} title={{ mr: 'गुणवत्ता जी प्रत्येक पेटीत दिसते', en: 'Quality you can see in every box' }} />
      <div className="grid gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-3">
        {ITEMS.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="bg-ink p-7 transition-colors hover:bg-ink-2"
          >
            <b className="mb-1.5 block font-display text-[1.2rem] text-ivory">{t(it.b)}</b>
            <span className="text-[.95rem] text-muted">{t(it.s)}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
