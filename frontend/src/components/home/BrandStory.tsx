'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal, { MaskReveal } from '../Reveal';
import { useLang } from '@/lib/i18n';

const CHAPTERS = [
  {
    k: { mr: '०१ · आमचे दुकान', en: '01 · Our shop' },
    h: { mr: 'माळेवाडी-अकलूज येथून', en: 'From Malewadi-Akluj' },
    p: {
      mr: 'आमची अगरबत्ती, धूप आणि पूजा साहित्य आम्ही स्वतः तयार करतो आणि माळेवाडी-अकलूज येथील दुकानातून घाऊक व किरकोळ विक्री करतो.',
      en: 'We make our own agarbatti, dhoop and puja sahitya, and sell wholesale and retail from our shop in Malewadi-Akluj.',
    },
  },
  {
    k: { mr: '०२ · आमचे ध्येय', en: '02 · Our mission' },
    h: { mr: 'आपल्या प्रत्येक पूजेसाठी… संजीवनी सोबत!', en: 'For every puja of yours… with Sanjivani!' },
    p: {
      mr: 'पूजेपासून सण-समारंभापर्यंत लागणारे सर्व पूजा साहित्य एकाच ठिकाणी, गुणवत्तेची खात्री आणि रास्त किमतीत.',
      en: 'Everything needed from daily puja to festivals, in one place, with assured quality and fair prices.',
    },
  },
  {
    k: { mr: '०३ · आमचा उद्देश', en: '03 · Our purpose' },
    h: { mr: 'गावागावात स्वयंरोजगार', en: 'Self-employment in every village' },
    p: {
      mr: 'ग्रामीण व शहरी भागातील युवक-युवतींना आणि महिलांना स्वयंरोजगार व व्यवसायाची संधी देणे हा आमचा उद्देश आहे.',
      en: 'Our aim is to create self-employment and business opportunities for young people and women in rural and urban areas.',
    },
  },
];

export default function BrandStory() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yBack = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const yFront = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -120]);

  return (
    <section ref={ref} className="section overflow-hidden" aria-labelledby="story-title">
      <div className="wrap grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        {/* layered imagery with restrained parallax */}
        <div className="relative h-[460px] sm:h-[560px] lg:sticky lg:top-28 lg:h-[620px]">
          <motion.div style={{ y: yBack }} className="absolute left-0 top-0 h-[78%] w-[82%]">
            <MaskReveal className="relative h-full w-full overflow-hidden rounded-[24px]">
              <Image src="/images/gallery/shop.jpg" alt="संजीवनी दुकान, माळेवाडी-अकलूज" fill sizes="(max-width: 1024px) 80vw, 480px" className="object-cover" />
            </MaskReveal>
          </motion.div>
          <motion.div style={{ y: yFront }} className="absolute bottom-0 right-0 w-[46%]">
            <MaskReveal delay={0.25} className="relative aspect-[3/4] overflow-hidden rounded-[24px] border-[6px] border-ivory shadow-lift">
              <Image src="/images/products/dhoop-box-chandan.jpg" alt="चंदन प्रीमियम धूप स्टिक बॉक्स" fill sizes="260px" className="object-cover" />
            </MaskReveal>
          </motion.div>
          <div className="absolute -left-3 bottom-16 hidden rounded-full bg-forest px-5 py-3 text-[.85rem] text-ivory shadow-lift sm:block">
            {t({ mr: 'स्वतः उत्पादन · घाऊक व किरकोळ', en: 'Own production · wholesale & retail' })}
          </div>
        </div>

        <div>
          <Reveal>
            <div className="eyebrow">{t({ mr: 'आमची कथा', en: 'Our story' })}</div>
            <h2 id="story-title" className="h-section mt-3">{t({ mr: 'एकच दुकान, पूजा साहित्याची संपूर्ण दुनिया', en: 'One shop, a whole world of puja sahitya' })}</h2>
          </Reveal>
          <ol className="mt-10 grid gap-10">
            {CHAPTERS.map((c, i) => (
              <Reveal as="li" key={i} delay={i * 0.05} className="border-l-2 border-gold/50 pl-6">
                <span className="text-[.8rem] font-semibold uppercase tracking-[.14em] text-gold-deep">{t(c.k)}</span>
                <h3 className="mt-1 text-[1.55rem] text-forest">{t(c.h)}</h3>
                <p className="mt-2 text-stone">{t(c.p)}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <Link href="/about" className="btn-link">{t({ mr: 'संस्थापक व पूर्ण कथा वाचा', en: 'Meet the founders' })} →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
