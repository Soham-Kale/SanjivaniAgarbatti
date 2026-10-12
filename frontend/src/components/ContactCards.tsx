'use client';

import Reveal from './Reveal';
import { useLang } from '@/lib/i18n';
import { useContent, useWa } from '@/lib/content-context';

export default function ContactCards() {
  const { t } = useLang();
  const { site } = useContent();
  const waLink = useWa();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Reveal className="card p-7">
        <h2 className="mb-3 text-[1.3rem] text-wood">{t({ mr: 'फोन', en: 'Phone' })}</h2>
        <ul className="grid gap-3">
          {site.phones.map((p) => (
            <li key={p.tel}>
              <a href={`tel:${p.tel}`} className="font-display text-[1.25rem] hover:text-gold-deep">{p.display}</a>
              <div className="text-[.85rem] text-stone">{t(p.person)}</div>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className="card p-7">
        <h2 className="mb-3 text-[1.3rem] text-wood">{t({ mr: 'पत्ता', en: 'Address' })}</h2>
        <p className="text-charcoal-soft">{t(site.address)}</p>
        {t(site.hours) && <p className="mt-2 text-[.9rem] text-stone">{t(site.hours)}</p>}
        <a href={site.mapUrl} target="_blank" rel="noopener" className="btn-outline mt-5 px-4 py-2 text-[.9rem]">
          {t({ mr: 'नकाशावर पाहा', en: 'Open in Maps' })}
        </a>
      </Reveal>
      <Reveal delay={0.2} className="card p-7">
        <h2 className="mb-3 text-[1.3rem] text-wood">WhatsApp / Email</h2>
        <a href={waLink('नमस्कार संजीवनी')} target="_blank" rel="noopener" className="btn-primary px-4 py-2 text-[.9rem]">
          {t({ mr: 'WhatsApp वर बोला', en: 'Chat on WhatsApp' })}
        </a>
        <p className="mt-5">
          <a href={`mailto:${site.email}`} className="text-charcoal-soft hover:text-gold-deep">{site.email}</a>
        </p>
      </Reveal>
    </div>
  );
}
