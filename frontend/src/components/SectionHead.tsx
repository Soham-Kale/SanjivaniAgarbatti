'use client';

import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

export default function SectionHead({
  eyebrow,
  title,
  text,
  as = 'h2',
  align = 'split',
}: {
  eyebrow: I18n;
  title: I18n;
  text?: I18n;
  as?: 'h1' | 'h2';
  align?: 'split' | 'center';
}) {
  const { t } = useLang();
  const H = as;
  if (align === 'center')
    return (
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <div className="eyebrow justify-center">{t(eyebrow)}</div>
        <H className="h-section mt-3">{t(title)}</H>
        {text && <p className="lede mx-auto mt-4">{t(text)}</p>}
      </Reveal>
    );
  return (
    <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="max-w-2xl">
        <div className="eyebrow">{t(eyebrow)}</div>
        <H className="h-section mt-3">{t(title)}</H>
      </div>
      {text && <p className="lede m-0">{t(text)}</p>}
    </Reveal>
  );
}
