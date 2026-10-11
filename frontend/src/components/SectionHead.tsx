'use client';

import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import type { I18n } from '@/lib/types';

export default function SectionHead({ eyebrow, title, text, as = 'h2' }: { eyebrow: I18n; title: I18n; text?: I18n; as?: 'h1' | 'h2' }) {
  const { t } = useLang();
  const H = as;
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="eyebrow">{t(eyebrow)}</div>
        <H className="mt-2 text-[clamp(2rem,4vw,3rem)]">{t(title)}</H>
      </div>
      {text && <p className="m-0 max-w-[44ch] text-muted">{t(text)}</p>}
    </Reveal>
  );
}
