'use client';

import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { SITE, waLink } from '@/lib/site';

export default function ContactCards() {
  const { t } = useLang();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Reveal className="card-surface p-7">
        <h3 className="mb-3 text-[1.3rem] text-gold">{t({ mr: 'फोन', en: 'Phone' })}</h3>
        <ul className="grid gap-3">
          {SITE.phones.map((p) => (
            <li key={p.tel}>
              <a href={`tel:${p.tel}`} className="font-display text-[1.25rem] hover:text-gold">{p.display}</a>
              <div className="text-[.85rem] text-muted">{t(p.person)}</div>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className="card-surface p-7">
        <h3 className="mb-3 text-[1.3rem] text-gold">{t({ mr: 'पत्ता', en: 'Address' })}</h3>
        <p className="text-sand">{t(SITE.address)}</p>
        <a href={SITE.mapUrl} target="_blank" rel="noopener" className="btn-ghost mt-5 px-4 py-2 text-[.9rem]">
          {t({ mr: 'नकाशावर पाहा', en: 'Open in Maps' })}
        </a>
      </Reveal>
      <Reveal delay={0.2} className="card-surface p-7">
        <h3 className="mb-3 text-[1.3rem] text-gold">WhatsApp / Email</h3>
        <a href={waLink('नमस्कार संजीवनी')} target="_blank" rel="noopener" className="btn-solid px-4 py-2 text-[.9rem]">
          {t({ mr: 'WhatsApp वर बोला', en: 'Chat on WhatsApp' })}
        </a>
        <p className="mt-5">
          <a href={`mailto:${SITE.email}`} className="text-sand hover:text-gold">{SITE.email}</a>
        </p>
      </Reveal>
    </div>
  );
}
