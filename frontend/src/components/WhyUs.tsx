'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import SectionHead from './SectionHead';
import { rise, stagger } from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';
import type { WhyIcon } from '@/lib/content';

function Icon({ name }: { name: WhyIcon }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      {name === 'clock' && (<><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 7.5V12l3 2" {...p} /></>)}
      {name === 'hand' && <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V11m0-5.5a1.5 1.5 0 0 1 3 0V11m0-4a1.5 1.5 0 0 1 3 0v6.5a6 6 0 0 1-6 6h-.7a5 5 0 0 1-3.9-1.9L4.6 14.4a1.5 1.5 0 0 1 2.3-1.9L8 14" {...p} />}
      {name === 'smoke' && <path d="M12 21v-5m0 0c-2-1.5-2-3.5 0-5s2-3.5 0-5m0 10c2-1 3.5-2.5 3-5M12 6c-1.6-.8-2.3-2-1.6-3.5" {...p} />}
      {name === 'flower' && (<><circle cx="12" cy="12" r="2.2" {...p} /><path d="M12 9.8C10 6 12 3.5 12 3.5s2 2.5 0 6.3Zm2.2 2.2c3.8-2 6.3 0 6.3 0s-2.5 2-6.3 0Zm-2.2 2.2c2 3.8 0 6.3 0 6.3s-2-2.5 0-6.3ZM9.8 12C6 14 3.5 12 3.5 12S6 10 9.8 12Z" {...p} /></>)}
      {name === 'cup' && (<><path d="M5 11h14l-1.5 7a2 2 0 0 1-2 1.6h-7a2 2 0 0 1-2-1.6L5 11Z" {...p} /><path d="M10 8c0-1 1-1.5 1-2.5M14 8c0-1 1-1.5 1-2.5" {...p} /></>)}
      {name === 'store' && (<><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" {...p} /><path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" {...p} /></>)}
    </svg>
  );
}

/** Card with a saffron spotlight that follows the mouse. */
function Spot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
        ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className="glow-border hover-glow group relative h-full overflow-hidden rounded-[26px] border border-charcoal/10 bg-white/80 p-7 shadow-card backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(320px_circle_at_var(--mx)_var(--my),rgba(255,122,26,.14),transparent_60%)]" />
      {children}
    </div>
  );
}

export default function WhyUs() {
  const { t } = useLang();
  const { why } = useContent();
  return (
    <section className="section relative overflow-hidden" aria-labelledby="why-title">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-saffron/15 via-gold/10 to-lotus/20 blur-[100px]" />
      <div className="wrap relative">
        <SectionHead align="center" eyebrow={why.eyebrow} title={why.title} text={why.text} />
        <motion.ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {why.items.map((it, i) => (
            <motion.li key={i} variants={rise}>
              <Spot>
                <div className="relative flex items-start justify-between">
                  <motion.span
                    whileHover={{ rotateY: 180 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-saffron via-ember to-maroon text-white shadow-glow-sm"
                  >
                    <Icon name={it.icon} />
                  </motion.span>
                  <span className="font-display text-[2.4rem] leading-none text-wood/10 transition-colors duration-500 group-hover:text-saffron/40">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="relative mt-6 font-display text-[1.4rem] text-wood">{t(it.b)}</h3>
                <p className="relative mt-1.5 text-[.95rem] text-stone">{t(it.s)}</p>
              </Spot>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
