'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function FranchiseOutlets() {
  const { t } = useLang();
  const { franchise } = useContent();
  const { outlets } = franchise;
  const items = outlets.items.filter((o) => o.photo || o.name.mr || o.name.en);
  if (!items.length) return null;
  const single = items.length === 1;
  return (
    <section id="outlets" className="wrap scroll-mt-24 pb-24">
      <SectionHead eyebrow={outlets.eyebrow} title={outlets.title} text={outlets.text} />
      <ul className={single ? 'grid' : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
        {items.map((o, i) => (
          <Reveal as="li" key={`${i}-${o.photo}`} delay={i * 0.08}>
            <article
              className={`group h-full overflow-hidden rounded-[24px] border border-charcoal/10 bg-white/80 shadow-card ${
                single ? 'grid md:grid-cols-[1.35fr_1fr]' : 'flex flex-col'
              }`}
            >
              <div className={`relative overflow-hidden bg-sand ${single ? 'aspect-[4/3] md:aspect-auto md:min-h-[360px]' : 'aspect-[4/3]'}`}>
                {o.photo && (
                  <Image
                    src={o.photo}
                    alt={t(o.name)}
                    fill
                    sizes={single ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                    className="object-cover object-top transition duration-700 ease-soft group-hover:scale-[1.03]"
                  />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-wood-night/80 px-3 py-1 text-[.8rem] font-semibold text-ivory backdrop-blur">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" aria-hidden />
                  {t({ mr: 'सुरू आहे', en: 'Open now' })}
                </span>
              </div>
              <div className={`flex flex-1 flex-col ${single ? 'justify-center p-7 md:p-10' : 'p-6'}`}>
                <div className="eyebrow">{t({ mr: `आउटलेट ${i + 1}`, en: `Outlet ${i + 1}` })}</div>
                <h3 className={`mt-2 font-display text-wood ${single ? 'text-[1.7rem]' : 'text-[1.3rem]'}`}>{t(o.name)}</h3>
                <p className="mt-3 flex gap-2 text-charcoal-soft">
                  <span className="text-gold-deep" aria-hidden>📍</span>
                  <span>{t(o.address)}</span>
                </p>
                {o.mapUrl && (
                  <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-link mt-5 text-[.95rem]">
                    {t({ mr: 'नकाशावर पाहा', en: 'Open in Maps' })} →
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
