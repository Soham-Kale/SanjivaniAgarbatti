'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Page transition on every route change: a plum curtain lifts away (pure CSS, so it also plays
 * before the scripts load), then the page rises in. The admin panel is left plain.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const admin = usePathname().startsWith('/admin');
  if (admin) return <>{children}</>;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] grid origin-top animate-curtain place-items-center bg-gradient-to-b from-wood-night via-wood to-wood-light motion-reduce:hidden">
        <span className="h-[2px] w-24 animate-curtain-mark rounded-full bg-gradient-to-r from-saffron via-gold to-maroon" />
      </div>
      <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}>
        {children}
      </motion.div>
    </>
  );
}
