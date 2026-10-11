'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';
import type { Product } from '@/lib/types';

/** "Add to order list" button with a brief confirmation tick. */
export default function AddToList({ p, qty = 1, size = 'md', openOnAdd = false }: { p: Product; qty?: number; size?: 'sm' | 'md'; openOnAdd?: boolean }) {
  const { add, setOpen } = useCart();
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const onClick = () => {
    add(p, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
    if (openOnAdd) setOpen(true);
  };
  const label = t({ mr: 'यादीत टाका', en: 'Add to list' });
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={`${label}: ${t(p.name)}`}
      className={
        size === 'sm'
          ? 'relative inline-flex h-10 min-w-10 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-forest px-3 text-[.82rem] font-semibold text-ivory transition hover:bg-forest-light'
          : 'btn-primary relative overflow-hidden'
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span key="ok" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
            ✓ {size === 'md' && t({ mr: 'जोडले', en: 'Added' })}
          </motion.span>
        ) : (
          <motion.span key="add" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="inline-flex items-center gap-1.5">
            <span aria-hidden>+</span> <span className={size === 'sm' ? 'hidden sm:inline' : ''}>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
