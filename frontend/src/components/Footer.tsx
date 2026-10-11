'use client';

import Link from 'next/link';
import { Brand } from './Header';
import { useLang } from '@/lib/i18n';
import { NAV, SITE, waLink } from '@/lib/site';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer id="contact" className="border-t border-line bg-ink-deep pb-28 pt-[70px]">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-center justify-between gap-5 rounded-[20px] border border-gold-soft bg-gradient-to-r from-[#2a1c10] to-transparent px-8 py-7">
          <div>
            <div className="eyebrow">{t({ mr: 'डीलर / होलसेल', en: 'Dealer / Wholesale' })}</div>
            <h3 className="text-[1.6rem]">{t({ mr: 'दुकानदार आहात? होलसेल दरासाठी संपर्क करा', en: 'Own a shop? Contact us for wholesale rates' })}</h3>
          </div>
          <Link className="btn-solid" href="/contact#dealer">
            {t({ mr: 'डीलर चौकशी', en: 'Dealer enquiry' })}
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-3.5 text-[.95rem] text-muted">Quality Products • Trusted Service • Complete Puja Solution</p>
          </div>
          <div>
            <h4 className="mb-3 text-[1.1rem] text-gold">{t({ mr: 'पत्ता', en: 'Address' })}</h4>
            <p className="text-[.95rem] text-muted">{t(SITE.address)}</p>
          </div>
          <div>
            <h4 className="mb-3 text-[1.1rem] text-gold">{t({ mr: 'संपर्क', en: 'Contact' })}</h4>
            <ul className="grid gap-1.5 text-[.95rem] text-muted">
              {SITE.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="hover:text-ivory">{p.display}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-ivory">{SITE.email}</a>
              </li>
              <li>
                <a href={waLink()} target="_blank" rel="noopener" className="hover:text-ivory">WhatsApp</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-[1.1rem] text-gold">{t({ mr: 'पाने', en: 'Pages' })}</h4>
            <ul className="grid gap-1.5 text-[.95rem] text-muted">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-ivory">{t(n.label)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-line pt-6 text-[.82rem] text-muted">
          © {new Date().getFullYear()} {t(SITE.name)}
        </p>
      </div>
    </footer>
  );
}
