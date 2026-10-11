'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/** 3D tilt-on-hover wrapper (the card/plan effect from the design), springy via Framer Motion. */
export default function Tilt({ children, className, max = 14 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });
  const rotateY = useTransform(sx, (v) => v * max);
  const rotateX = useTransform(sy, (v) => -v * max);

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={ref}
        className={className}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={(e) => {
          if (reduce || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
