'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * A quick fade on every route change. It is kept short so a new page shows at once; the
 * admin panel is left plain.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const admin = usePathname().startsWith('/admin');
  if (admin) return <>{children}</>;
  return (
    <motion.div initial={reduce ? false : { opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
