'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

const FOUNDERS = [
  { img: '/images/brand/founder-somnath.jpg', name: SITE.phones[0].person, role: 'FOUNDER & CEO' },
  { img: '/images/brand/founder-onkar.jpg', name: SITE.phones[1].person, role: 'FOUNDER & M.D.' },
];

export default function AboutFounders({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const { t } = useLang();
  const H = headingLevel;
  return (
    <section id="about" className="section wrap scroll-mt-16">
      <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="eyebrow">{t({ mr: 'आमच्याविषयी', en: 'About us' })}</div>
          <H className="h-section mt-3">
            {t({ mr: 'एकच दुकान, पूजा साहित्याची संपूर्ण दुनिया', en: 'One shop, a whole world of puja sahitya' })}
          </H>
          <p className="my-[18px] font-display text-[1.7rem] text-gold-deep">“आपल्या प्रत्येक पूजेसाठी… संजीवनी सोबत!”</p>
          <p className="text-charcoal-soft">
            {t({
              mr: 'पूजेपासून सण-समारंभापर्यंत लागणारे सर्व प्रकारचे पूजा साहित्य एकाच ठिकाणी, गुणवत्तेची खात्री आणि रास्त किमतीत. ग्रामीण व शहरी भागातील युवक-युवतींना आणि महिलांना स्वयंरोजगार व व्यवसायाची संधी देणे हा आमचा उद्देश आहे.',
              en: 'Everything needed from daily puja to festivals, in one place, with assured quality and fair prices. Our aim is to create self-employment and business opportunities for young people and women in rural and urban areas.',
            })}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-[18px]">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.role} delay={i * 0.12} className="text-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-charcoal/10">
                <Image src={f.img} alt={f.name.mr} fill sizes="(max-width: 768px) 50vw, 260px" className="object-cover saturate-[.9]" />
              </div>
              <b className="mt-2.5 block font-display text-[1.1rem]">{t(f.name)}</b>
              <span className="text-[.82rem] tracking-[.08em] text-gold-deep">{f.role}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
