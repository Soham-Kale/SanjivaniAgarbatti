'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

/** Render loop only while the canvas is on screen; a single still frame for reduced motion. */
export function useCanvasLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '120px' });
  const reduce = useReducedMotion();
  const frameloop: 'always' | 'never' | 'demand' = reduce ? 'demand' : inView ? 'always' : 'never';
  return { ref, frameloop, reduce: !!reduce };
}
