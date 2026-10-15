'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { NoProfitNote } from './FranchisePlans';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export default function FranchiseWhy() {
  const { t } = useLang();
  const { why } = useContent().franchise;
  if (!why.image) return null;
  return (
    <section id="why" className="wrap scroll-mt-24 pb-24">
      <SectionHead eyebrow={why.eyebrow} title={why.title} />
      <Reveal>
        <a
          href={why.image}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-[3/2] overflow-hidden rounded-[24px] border border-gold/30 bg-ivory-2 shadow-lift"
          aria-label={t({ mr: 'फोटो मोठा पाहा', en: 'Open full size' })}
        >
          <Image src={why.image} alt={t(why.alt)} fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-contain transition duration-700 ease-soft group-hover:scale-[1.01]" />
        </a>
        <p className="mt-3 text-center text-[.85rem] text-stone">{t({ mr: 'मोठा फोटो पाहण्यासाठी टॅप करा', en: 'Tap to open full size' })}</p>
      </Reveal>
      <NoProfitNote />
    </section>
  );
}
