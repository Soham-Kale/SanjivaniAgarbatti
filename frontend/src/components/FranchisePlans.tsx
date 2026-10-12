'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Tilt from './Tilt';
import Reveal, { rise, stagger } from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

export function Plans({ withCta = false, dark = false }: { withCta?: boolean; dark?: boolean }) {
  const { t } = useLang();
  const { franchise } = useContent();
  return (
    <motion.ul className="grid gap-5 md:grid-cols-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {franchise.plans.map((p) => {
        const feat = p.featured;
        const surface = dark
          ? feat
            ? 'border-gold bg-gradient-to-b from-wood-light to-wood-deep'
            : 'border-ivory/15 bg-wood-deep/60'
          : feat
            ? 'border-wood bg-wood text-ivory'
            : 'border-charcoal/10 bg-ivory-2';
        const light = dark || feat;
        return (
          <motion.li key={p.id} variants={rise}>
            <Tilt max={5} className={`flex h-full flex-col rounded-[24px] border p-7 ${surface}`}>
              {feat && <span className="mb-3 inline-block self-start rounded-full bg-gold px-3 py-0.5 text-[.72rem] font-semibold uppercase tracking-[.14em] text-wood-night">{t({ mr: 'लोकप्रिय', en: 'Popular' })}</span>}
              <h3 className={`text-[1.5rem] ${light ? 'text-ivory' : 'text-wood'}`}>{t(p.name)}</h3>
              <div className={`mt-3 font-display text-[2.5rem] tabular-nums ${light ? 'text-gold-light' : 'text-wood'}`}>{p.amount}</div>
              <div className={`text-[.9rem] ${light ? 'text-mist' : 'text-stone'}`}>{t(p.deposit)}</div>
              <ul className={`mt-5 grid gap-2 text-[.95rem] ${light ? 'text-ivory/90' : 'text-charcoal-soft'}`}>
                {p.points.map((pt, k) => (
                  <li key={k} className="flex gap-2.5">
                    <span className={light ? 'text-gold-light' : 'text-gold-deep'}>✦</span>
                    {t(pt)}
                  </li>
                ))}
              </ul>
              {withCta && (
                <Link href={`/franchise?plan=${p.id}#enquiry`} className="mt-auto pt-7">
                  <span className={feat ? 'btn-gold w-full' : light ? 'btn-outline-light w-full' : 'btn-outline w-full'}>{t({ mr: 'चौकशी करा', en: 'Enquire' })}</span>
                </Link>
              )}
            </Tilt>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export function Steps() {
  const { t } = useLang();
  const { franchise } = useContent();
  return (
    <Reveal>
      <ol
        aria-label={t({ mr: 'फ्रँचायझी प्रक्रिया', en: 'Franchise process' })}
        className="relative mt-16 grid grid-cols-4 gap-y-8 lg:grid-cols-8 lg:before:absolute lg:before:left-[6%] lg:before:right-[6%] lg:before:top-[22px] lg:before:h-px lg:before:bg-gradient-to-r lg:before:from-transparent lg:before:via-gold lg:before:to-transparent"
      >
        {franchise.steps.map((s, i) => (
          <li key={i} className="relative px-1.5 text-center">
            <span className="relative mx-auto mb-2.5 grid h-11 w-11 place-items-center rounded-full border border-gold bg-ivory font-display text-[1.1rem] text-wood">
              {t({ mr: String(i + 1).replace(/\d/g, (d) => '०१२३४५६७८९'[Number(d)]), en: String(i + 1) })}
            </span>
            <span className="text-[.88rem] text-charcoal-soft">{t(s)}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function NoProfitNote({ dark = false }: { dark?: boolean }) {
  const { t } = useLang();
  const { franchise } = useContent();
  return <p className={`mt-8 max-w-[80ch] border-l-2 border-gold pl-4 text-[.88rem] ${dark ? 'text-mist' : 'text-stone'}`}>{t(franchise.note)}</p>;
}
