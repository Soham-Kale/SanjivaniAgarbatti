'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import Tilt from './Tilt';
import PageHero from './PageHero';
import SplitWords from './fx/SplitWords';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';

/** About text and founders. As the page's opening (`h1`) the title moves into a dark page hero. */
export default function AboutFounders({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const { t } = useLang();
  const { site, about } = useContent();
  const founders = site.phones.filter((p) => p.photo);
  const isPage = headingLevel === 'h1';
  return (
    <>
      {isPage && <PageHero eyebrow={about.eyebrow} title={about.title} />}
      <section id="about" className="section relative scroll-mt-16 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-saffron/15 blur-[110px]" />
        <div className="wrap relative grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
          <div>
            {!isPage && (
              <>
                <Reveal y={12}>
                  <div className="eyebrow">{t(about.eyebrow)}</div>
                </Reveal>
                <h2 className="h-section mt-3">
                  <SplitWords text={t(about.title)} />
                </h2>
              </>
            )}
            <Reveal>
              <p className="text-gradient-deep my-[18px] font-display text-[clamp(1.8rem,3.4vw,2.4rem)] leading-snug">{about.quote}</p>
              <p className="text-[1.05rem] text-charcoal-soft">{t(about.text)}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-[18px]">
            {founders.map((f, i) => (
              <Reveal key={f.tel} delay={i * 0.12} className={`text-center ${i % 2 ? 'md:mt-14' : ''}`}>
                <Tilt max={10} fill={false} className="glow-border hover-glow relative aspect-[3/4] overflow-hidden rounded-[26px] border border-charcoal/10 shadow-lift">
                  <Image src={media(f.photo)} alt={f.person.mr} fill sizes="(max-width: 768px) 50vw, 260px" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-wood-night/70 to-transparent" />
                </Tilt>
                <b className="mt-3 block font-display text-[1.15rem] font-normal text-wood">{t(f.person)}</b>
                <span className="text-[.82rem] tracking-[.08em] text-gold-deep">{f.role}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
