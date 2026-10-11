'use client';

import Link from 'next/link';
import Tilt from './Tilt';
import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { NO_PROFIT_NOTE, PLANS, STEPS } from '@/lib/site';

export function Plans({ withCta = false }: { withCta?: boolean }) {
  const { t } = useLang();
  return (
    <div className="grid gap-[22px] md:grid-cols-3">
      {PLANS.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.1}>
          <Tilt
            max={8}
            className={`h-full rounded-[22px] border p-[30px] ${
              p.featured ? 'border-gold bg-gradient-to-b from-[#3a2814] to-[#1a120c]' : 'border-line bg-ink-2'
            }`}
          >
            {p.featured && (
              <span className="mb-2.5 inline-block rounded-full bg-gold px-2.5 py-0.5 text-[.72rem] uppercase tracking-[.14em] text-[#1a1209]">
                {t({ mr: 'लोकप्रिय', en: 'Popular' })}
              </span>
            )}
            <h3 className="text-[1.5rem]">{t(p.name)}</h3>
            <div className="mb-0.5 mt-3.5 font-display text-[2.6rem] tabular-nums text-gold">{p.amount}</div>
            <div className="text-[.9rem] text-muted">{t(p.deposit)}</div>
            <ul className="mt-5 grid gap-2 text-[.95rem]">
              {p.points.map((pt) => (
                <li key={pt.mr}>
                  <span className="mr-2 text-gold">✦</span>
                  {t(pt)}
                </li>
              ))}
            </ul>
            {withCta && (
              <Link href={`/franchise?plan=${p.id}#enquiry`} className={`mt-6 ${p.featured ? 'btn-solid' : 'btn-ghost'}`}>
                {t({ mr: 'चौकशी करा', en: 'Enquire' })}
              </Link>
            )}
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}

export function Steps() {
  const { t } = useLang();
  return (
    <Reveal>
      <ol
        aria-label="फ्रँचायझी प्रक्रिया"
        className="relative mt-[60px] grid grid-cols-4 gap-y-6 lg:grid-cols-8 lg:before:absolute lg:before:left-[6%] lg:before:right-[6%] lg:before:top-[22px] lg:before:h-px lg:before:bg-gradient-to-r lg:before:from-transparent lg:before:via-gold lg:before:to-transparent"
      >
        {STEPS.map((s, i) => (
          <li key={s.mr} className="relative px-1.5 text-center">
            <span className="mx-auto mb-2.5 grid h-11 w-11 place-items-center rounded-full border border-gold bg-ink font-display text-gold">
              {t({ mr: '१२३४५६७८'[i], en: String(i + 1) })}
            </span>
            <span className="text-[.88rem] text-sand">{t(s)}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function NoProfitNote() {
  const { t } = useLang();
  return <p className="mt-[34px] max-w-[80ch] border-l-2 border-gold-soft pl-3.5 text-[.86rem] text-muted">{t(NO_PROFIT_NOTE)}</p>;
}
