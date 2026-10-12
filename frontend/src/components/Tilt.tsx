'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * 3D tilt that follows the pointer, with a soft light glare where the pointer is
 * (mouse only; touch devices stay flat). Children can lift off the card with
 * `style={{ transform: 'translateZ(40px)' }}`.
 */
export default function Tilt({ children, className, max = 8, glare = true }: { children: React.ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const rotateY = useTransform(sx, (v) => v * max);
  const rotateX = useTransform(sy, (v) => -v * max);
  const gx = useTransform(sx, (v) => `${(v + 0.5) * 100}%`);
  const gy = useTransform(sy, (v) => `${(v + 0.5) * 100}%`);
  const glareO = useMotionValue(0);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,236,200,.38), rgba(255,255,255,0) 55%)`;

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        className={className}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
          glareO.set(1);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
          glareO.set(0);
        }}
      >
        {children}
        {glare && !reduce && (
          <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-soft-light transition-opacity duration-500" style={{ background: glareBg, opacity: glareO }} />
        )}
      </motion.div>
    </div>
  );
}
