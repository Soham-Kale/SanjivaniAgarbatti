'use client';

import { motion } from 'framer-motion';
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

export default function WhyUs() {
  const { t } = useLang();
  const { why } = useContent();
  return (
    <section className="section wrap" aria-labelledby="why-title">
      <SectionHead
        align="center"
        eyebrow={why.eyebrow}
        title={why.title}
        text={why.text}
      />
      <motion.ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        {why.items.map((it, i) => (
          <motion.li key={i} variants={rise} className="group card flex gap-5 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lift">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-wood text-gold-light transition-transform duration-500 group-hover:rotate-[-6deg]">
              <Icon name={it.icon} />
            </span>
            <div>
              <h3 className="font-display text-[1.3rem] text-wood">{t(it.b)}</h3>
              <p className="mt-1 text-[.95rem] text-stone">{t(it.s)}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
