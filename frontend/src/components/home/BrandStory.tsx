'use client';

import Image from 'next/image';
import Link from 'next/link';
import Reveal, { MaskReveal } from '../Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import { media } from '@/lib/media';

export default function BrandStory() {
  const { t } = useLang();
  const { story } = useContent();
  const [lead, ...shots] = story.photos;

  return (
    <section className="section overflow-hidden" aria-labelledby="story-title">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* shop photo with two real packs below; each image says what it shows */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:sticky lg:top-28">
          {lead && (
          <figure className="col-span-2">
            <MaskReveal className="relative aspect-[16/10] overflow-hidden rounded-[22px] shadow-card">
              <Image src={media(lead.src)} alt={t(lead.cap)} fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
              <span className="absolute bottom-3 left-3 rounded-full bg-wood/90 px-4 py-1.5 text-[.8rem] text-ivory backdrop-blur">
                {t(lead.cap)}
              </span>
            </MaskReveal>
          </figure>
          )}
          {shots.slice(0, 2).map((s, i) => (
            <figure key={s.src}>
              <MaskReveal delay={0.15 + i * 0.1} className="relative aspect-[4/5] overflow-hidden rounded-[22px] shadow-card">
                <Image src={media(s.src)} alt={t(s.cap)} fill sizes="(max-width: 1024px) 50vw, 280px" className="object-cover" />
              </MaskReveal>
              <figcaption className="mt-2 text-[.82rem] leading-snug text-stone">{t(s.cap)}</figcaption>
            </figure>
          ))}
        </div>

        <div>
          <Reveal>
            <div className="eyebrow">{t(story.eyebrow)}</div>
            <h2 id="story-title" className="h-section mt-3">{t(story.title)}</h2>
          </Reveal>
          <ol className="mt-10 grid gap-10">
            {story.chapters.map((c, i) => (
              <Reveal as="li" key={i} delay={i * 0.05} className="border-l-2 border-gold/50 pl-6">
                <span className="text-[.8rem] font-semibold uppercase tracking-[.14em] text-gold-deep">{t(c.k)}</span>
                <h3 className="mt-1 text-[1.55rem] text-wood">{t(c.h)}</h3>
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
