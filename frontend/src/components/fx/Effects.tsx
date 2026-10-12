'use client';

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Saffron-to-kumkum reading progress line along the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-saffron via-gold to-maroon" />;
}

/**
 * Soft ring that trails the mouse and grows over links and buttons. Mouse pointers only:
 * touch screens and reduced-motion visitors never see it.
 */
export function CursorRing() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHover(!!el?.closest('a, button, [role="tab"], input, select, textarea, label'));
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, [reduce, x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-saffron/80"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: hover ? 54 : 26, height: hover ? 54 : 26, backgroundColor: hover ? 'rgba(255,122,26,.18)' : 'rgba(255,122,26,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    />
  );
}
