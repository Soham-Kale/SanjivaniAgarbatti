'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Aurora from './fx/Aurora';
import { Brand } from './Header';
import { useLang } from '@/lib/i18n';
import { CATEGORIES, NAV } from '@/lib/site';
import { useContent, useWa } from '@/lib/content-context';

export default function Footer() {
  const { t } = useLang();
  const { site, footer } = useContent();
  const waLink = useWa();
  return (
    <footer className="on-dark relative overflow-hidden bg-wood-night pb-28 pt-20 text-mist">
      <Aurora tone="cool" className="opacity-70" />
      <div className="wrap relative">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Brand dark />
            <p className="mt-5 max-w-xs text-[.95rem]">{t(footer.blurb)}</p>
            <p className="mt-4 text-[.8rem] tracking-wide text-gold-light/80">{site.motto}</p>
          </div>
          <div>
            <h3 className="mb-4 font-body text-[.8rem] font-semibold uppercase tracking-[.16em] text-saffron">{t({ mr: 'उत्पादने', en: 'Products' })}</h3>
            <ul className="grid gap-2 text-[.95rem]">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <li key={c.id}>
                  <Link href={`/products?c=${c.id}`} className="hover:text-ivory">{t(c.label)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-body text-[.8rem] font-semibold uppercase tracking-[.16em] text-saffron">{t({ mr: 'माहिती', en: 'Explore' })}</h3>
            <ul className="grid gap-2 text-[.95rem]">
              {NAV.filter((n) => n.href !== '/products').map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-ivory">{t(n.label)}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact#dealer" className="hover:text-ivory">{t({ mr: 'डीलर / होलसेल', en: 'Dealer / wholesale' })}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-body text-[.8rem] font-semibold uppercase tracking-[.16em] text-saffron">{t({ mr: 'संपर्क', en: 'Contact' })}</h3>
            <address className="not-italic">
              <p className="text-[.95rem]">{t(site.address)}</p>
              {t(site.hours) && <p className="mt-1 text-[.88rem]">{t(site.hours)}</p>}
              <ul className="mt-4 grid gap-2 text-[.95rem]">
                {site.phones.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} className="text-ivory hover:text-gold-light">{p.display}</a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${site.email}`} className="break-all hover:text-ivory">{site.email}</a>
                </li>
                <li>
                  <a href={waLink()} target="_blank" rel="noopener" className="hover:text-ivory">WhatsApp ↗</a>
                </li>
              </ul>
            </address>
          </div>
        </div>
        {/* giant wordmark rising into view */}
        <motion.p
          aria-hidden
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient pointer-events-none mt-16 select-none text-center font-display text-[clamp(4.5rem,17vw,15rem)] leading-[1.15] opacity-90"
        >
          {t(site.name).split(' ')[0]}
        </motion.p>
        <div className="hairline mt-6" />
        <div className="mt-6 flex flex-wrap justify-between gap-3 text-[.82rem] text-mist/70">
          <p>© {new Date().getFullYear()} {t(site.name)}</p>
          <p>{t(footer.note)}</p>
        </div>
      </div>
    </footer>
  );
}
