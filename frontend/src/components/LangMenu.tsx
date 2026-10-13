'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

const OPTIONS: { id: Lang; label: string; hint: string }[] = [
  { id: 'mr', label: 'मराठी', hint: 'Marathi' },
  { id: 'en', label: 'English', hint: 'इंग्रजी' },
];

/** Language dropdown in the header. Marathi is the default; the choice is remembered. */
export default function LangMenu({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.id === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${current.label}: ${lang === 'mr' ? 'भाषा निवडा · Choose language' : 'Choose language · भाषा निवडा'}`}
        className={`flex h-11 items-center gap-1.5 rounded-full border px-2.5 text-[.82rem] font-semibold sm:px-3.5 ${dark ? 'border-ivory/30' : 'border-charcoal/15'}`}
      >
        <GlobeIcon />
        <span className="hidden sm:inline">{current.label}</span>
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="भाषा · Language"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+8px)] z-[70] min-w-[170px] origin-top-right overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-1.5 text-charcoal shadow-lift"
          >
            {OPTIONS.map((o) => (
              <li key={o.id} role="option" aria-selected={o.id === lang}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(o.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[.92rem] transition-colors ${o.id === lang ? 'bg-sand font-semibold text-wood' : 'hover:bg-ivory-2'}`}
                >
                  <span>
                    {o.label}
                    <span className="ml-2 text-[.75rem] font-normal text-stone">{o.hint}</span>
                  </span>
                  {o.id === lang && <span className="text-maroon" aria-hidden="true">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}
