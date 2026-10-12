'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Heading text whose words rise out of a mask one after another when scrolled into view.
 * `highlight` (0-based word index) gets the saffron-gold gradient. Words are split on spaces
 * only, so Devanagari conjuncts and matras are never broken apart.
 */
export default function SplitWords({ text, highlight, delay = 0, className = '', immediate = false }: { text: string; highlight?: number; delay?: number; className?: string; immediate?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const hl = highlight ?? (words.length > 2 ? words.length - 1 : -1);
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-60px' } };
  return (
    <motion.span className={className} initial={reduce ? false : 'hidden'} {...trigger} transition={{ staggerChildren: 0.07, delayChildren: delay }}>
      {words.map((w, i) => (
        <Fragment key={i}>
        <span className="inline-block overflow-hidden pb-[.14em] pt-[.1em] align-top">
          <motion.span
            className={`inline-block ${i === hl ? 'text-gradient-deep [.on-dark_&]:text-gradient' : ''}`}
            variants={{ hidden: { y: '115%', rotate: 4 }, show: { y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } } }}
          >
            {w}
          </motion.span>
        </span>
        {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  );
}
