'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { NAV } from '@/lib/site';

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <Image src="/images/brand/logo-180.png" alt="संजीवनी लोगो" width={46} height={46} className="h-[46px] w-[46px] rounded-full border border-gold-soft bg-ivory object-contain" />
      <span>
        <b className="block font-display text-[1.45rem] font-bold leading-none text-gold">संजीवनी</b>
        <small className="block text-[.66rem] tracking-[.2em] text-muted">INCENSE STICKS</small>
      </span>
    </Link>
  );
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-[14px]">
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Brand />
        <nav className="hidden gap-[22px] text-[.95rem] lg:flex" aria-label="मुख्य">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`transition-colors hover:text-ivory ${path === n.href ? 'text-gold' : 'text-muted'}`}
            >
              {t(n.label)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
            className="rounded-full border border-line px-3 py-1 text-[.8rem] text-gold"
            aria-label={lang === 'mr' ? 'Switch to English' : 'मराठीत पाहा'}
          >
            <span className={lang === 'mr' ? 'text-ivory' : ''}>मराठी</span> | <span className={lang === 'en' ? 'text-ivory' : ''}>EN</span>
          </button>
          <button
            type="button"
            className="rounded-lg border border-line px-2.5 py-1.5 text-ivory lg:hidden"
            aria-label="मेनू"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-line bg-ink-2 lg:hidden"
          >
            <div className="wrap flex flex-col gap-3 py-4">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-muted hover:text-ivory">
                  {t(n.label)}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
