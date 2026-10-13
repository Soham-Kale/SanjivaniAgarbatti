'use client';

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Endless ribbon of words. It drifts on its own and speeds up (or reverses) with the
 * visitor's scroll velocity.
 */
export default function Marquee({ items, speed = 2.2, className = '' }: { items: string[]; speed?: number; className?: string }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * speed * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = 1;
    else if (f > 0) dir.current = -1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });

  const row = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <motion.div className="flex shrink-0 items-center" style={{ x }}>
        {[0, 1].map((k) => (
          <span key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6 font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.6]">{w}</span>
                <span className="text-[1.1rem] opacity-70">✦</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
