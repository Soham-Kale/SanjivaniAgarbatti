'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { NAV } from '@/lib/site';

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="संजीवनी मुख्य पान">
      <Image src="/images/brand/logo-180.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full bg-ivory object-contain ring-2 ring-gold/50 transition-transform duration-700 ease-soft group-hover:rotate-[360deg]" priority />
      <span className="leading-none">
        <b className={`block font-display text-[1.55rem] font-normal ${dark ? 'text-ivory' : 'text-wood'}`}>संजीवनी</b>
        <small className={`mt-0.5 hidden text-[.62rem] sm:block font-semibold tracking-[.24em] ${dark ? 'text-gold-light' : 'text-gold-deep'}`}>INCENSE STICKS</small>
      </span>
    </Link>
  );
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

// pages that open with a dark hero: the header starts transparent with light text
const DARK_TOP = ['/', '/products', '/franchise', '/contact', '/about'];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count, setOpen: openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40));
  useEffect(() => setOpen(false), [path]);

  const [hovered, setHovered] = useState<string | null>(null);
  const overHero = DARK_TOP.includes(path) && !scrolled && !open;
  const tone = overHero ? 'text-ivory' : 'text-charcoal';

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        overHero ? 'border-b border-transparent bg-transparent' : 'border-b border-charcoal/10 bg-ivory/80 shadow-[0_10px_40px_-24px_rgba(43,23,69,.5)] backdrop-blur-2xl backdrop-saturate-150'
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Brand dark={overHero} />
        <nav className={`hidden items-center gap-1 rounded-full border p-1 lg:flex ${overHero ? 'border-ivory/15 bg-white/5 backdrop-blur' : 'border-charcoal/10 bg-white/60'}`} aria-label="मुख्य मेनू" onMouseLeave={() => setHovered(null)}>
          {NAV.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onMouseEnter={() => setHovered(n.href)}
                className={`relative rounded-full px-4 py-2 text-[.93rem] font-medium transition-colors ${active ? (overHero ? 'text-wood-night' : 'text-ivory') : tone}`}
              >
                {active && <motion.span layoutId="nav-active" className={`absolute inset-0 rounded-full ${overHero ? 'bg-gradient-to-r from-saffron to-gold' : 'bg-wood'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {hovered === n.href && !active && <motion.span layoutId="nav-hover" className={`absolute inset-0 rounded-full ${overHero ? 'bg-white/10' : 'bg-wood/5'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{t(n.label)}</span>
              </Link>
            );
          })}
        </nav>
        <div className={`flex items-center gap-1.5 ${tone}`}>
          <button
            type="button"
            onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
            className={`h-11 rounded-full border px-3.5 text-[.82rem] font-semibold ${overHero ? 'border-ivory/30' : 'border-charcoal/15'}`}
            aria-label={lang === 'mr' ? 'Switch to English' : 'मराठीत पाहा'}
          >
            <span className={lang === 'mr' ? '' : 'opacity-50'}>मराठी</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={lang === 'en' ? '' : 'opacity-50'}>EN</span>
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => openCart(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-charcoal/5"
            aria-label={t({ mr: `ऑर्डर यादी, ${count} वस्तू`, en: `Order list, ${count} items` })}
          >
            <BagIcon />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-saffron to-maroon px-1 text-[.7rem] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full lg:hidden" aria-label={open ? 'मेनू बंद करा' : 'मेनू उघडा'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3.5 w-5">
              <motion.span className="absolute left-0 top-0 h-[1.5px] w-5 bg-current" animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} />
              <motion.span className="absolute left-0 top-[6px] h-[1.5px] w-5 bg-current" animate={{ opacity: open ? 0 : 1 }} />
              <motion.span className="absolute left-0 top-3 h-[1.5px] w-5 bg-current" animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="मोबाईल मेनू"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden bg-wood-night lg:hidden"
          >
            <motion.ul className="wrap grid gap-1 py-5" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.05 } } }}>
              {NAV.map((n) => (
                <motion.li key={n.href} variants={{ h: { opacity: 0, x: -12 }, s: { opacity: 1, x: 0 } }}>
                  <Link href={n.href} className={`flex min-h-[56px] items-center justify-between border-b border-white/10 font-display text-[1.5rem] ${path === n.href ? 'text-gradient' : 'text-ivory'}`}>
                    {t(n.label)}
                    <span className="text-saffron">→</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
