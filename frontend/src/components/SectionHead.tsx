'use client';

import Reveal from './Reveal';
import SplitWords from './fx/SplitWords';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

export default function SectionHead({
  eyebrow,
  title,
  text,
  as = 'h2',
  align = 'split',
  highlight,
}: {
  eyebrow: I18n;
  title: I18n;
  text?: I18n;
  as?: 'h1' | 'h2';
  align?: 'split' | 'center';
  /** word index shown in the gradient; defaults to the last word of longer titles */
  highlight?: number;
}) {
  const { t } = useLang();
  const H = as;
  const heading = (
    <H className="h-section mt-3">
      <SplitWords text={t(title)} highlight={highlight} immediate={as === 'h1'} />
    </H>
  );
  if (align === 'center')
    return (
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <Reveal y={12}>
          <div className="eyebrow justify-center">{t(eyebrow)}</div>
        </Reveal>
        {heading}
        {text && (
          <Reveal delay={0.2}>
            <p className="lede mx-auto mt-4">{t(text)}</p>
          </Reveal>
        )}
      </div>
    );
  return (
    <div className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="max-w-2xl">
        <Reveal y={12}>
          <div className="eyebrow">{t(eyebrow)}</div>
        </Reveal>
        {heading}
      </div>
      {text && (
        <Reveal delay={0.2}>
          <p className="lede m-0">{t(text)}</p>
        </Reveal>
      )}
    </div>
  );
}
