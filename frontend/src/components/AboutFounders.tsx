'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';

export default function AboutFounders({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const { t } = useLang();
  const { site, about } = useContent();
  const founders = site.phones.filter((p) => p.photo);
  const H = headingLevel;
  return (
    <section id="about" className="section wrap scroll-mt-16">
      <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="eyebrow">{t(about.eyebrow)}</div>
          <H className="h-section mt-3">
            {t(about.title)}
          </H>
          <p className="my-[18px] font-display text-[1.7rem] text-gold-deep">{about.quote}</p>
          <p className="text-charcoal-soft">
            {t(about.text)}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-[18px]">
          {founders.map((f, i) => (
            <Reveal key={f.tel} delay={i * 0.12} className="text-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-charcoal/10">
                <Image src={media(f.photo)} alt={f.person.mr} fill sizes="(max-width: 768px) 50vw, 260px" className="object-cover saturate-[.9]" />
              </div>
              <b className="mt-2.5 block font-display text-[1.1rem]">{t(f.person)}</b>
              <span className="text-[.82rem] tracking-[.08em] text-gold-deep">{f.role}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
