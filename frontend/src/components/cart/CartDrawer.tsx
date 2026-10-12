'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';
import { submitEnquiry } from '@/lib/enquiry';
import { useContent, useWa } from '@/lib/content-context';
import { media } from '@/lib/media';
import { rupees } from '@/lib/price';

type Stage = 'list' | 'details' | 'sent';

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear, count } = useCart();
  const { t } = useLang();
  const { site } = useContent();
  const waLink = useWa();
  const priced = items.length > 0 && items.every((i) => typeof i.price === 'number');
  const total = priced ? items.reduce((s, i) => s + (i.price as number) * i.qty, 0) : 0;
  const [stage, setStage] = useState<Stage>('list');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [waUrl, setWaUrl] = useState('');
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    setTimeout(() => panel.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) setTimeout(() => setStage((s) => (s === 'sent' ? 'list' : s)), 400);
  }, [open]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const lines = items.map((it, i) => `${i + 1}. ${it.name.mr} × ${it.qty}${typeof it.price === 'number' ? ` (${rupees(it.price)})` : ''}`);
    if (priced) lines.push(`अंदाजे एकूण: ${rupees(total)}`);
    const text = ['नमस्कार संजीवनी, माझी ऑर्डर:', ...lines, '', `नाव: ${f.name}`, `मोबाईल: ${f.mobile}`, f.city && `पत्ता / गाव: ${f.city}`, f.message && `टीप: ${f.message}`].filter(Boolean).join('\n');
    // open the tab inside the click so popup blockers allow it, then point it at WhatsApp
    const win = window.open('', '_blank');
    setBusy(true);
    setErrors({});
    const r = await submitEnquiry('order', { ...f, items: items.map((i) => ({ slug: i.slug, name: i.name.mr, qty: i.qty })) });
    setBusy(false);
    if (!r.ok && r.fields) {
      win?.close();
      setErrors(r.fields);
      return;
    }
    // Saved (or backend offline): either way the shop gets the order on WhatsApp.
    const url = waLink(text);
    setWaUrl(url);
    if (win) win.location.href = url;
    clear();
    setStage('sent');
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <motion.div className="absolute inset-0 bg-wood-night/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            ref={panel}
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl outline-none"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
              <h2 id="cart-title" className="text-[1.5rem] text-wood">
                {t({ mr: 'ऑर्डर यादी', en: 'Order list' })} {count > 0 && <span className="text-stone">({count})</span>}
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-charcoal/5" aria-label={t({ mr: 'बंद करा', en: 'Close' })}>
                ✕
              </button>
            </div>

            {stage === 'sent' ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-wood text-2xl text-gold-light">✓</span>
                <h3 className="mt-5 text-[1.6rem] text-wood">{t({ mr: 'धन्यवाद!', en: 'Thank you!' })}</h3>
                <p className="mt-2 text-stone">{t({ mr: 'तुमची ऑर्डर WhatsApp वर उघडली आहे. संदेश पाठवा, आम्ही किंमत व डिलिव्हरी कळवू.', en: 'Your order has opened in WhatsApp. Send the message and we will confirm price and delivery.' })}</p>
                {waUrl && <a href={waUrl} target="_blank" rel="noopener" className="btn-primary mt-6">{t({ mr: 'WhatsApp पुन्हा उघडा', en: 'Open WhatsApp again' })}</a>}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-[1.4rem] text-wood">{t({ mr: 'यादी रिकामी आहे', en: 'Your list is empty' })}</p>
                <p className="mt-2 text-stone">{t({ mr: 'उत्पादनांवरील “यादीत टाका” वापरा.', en: 'Use “Add to list” on any product.' })}</p>
                <Link href="/products" onClick={() => setOpen(false)} className="btn-primary mt-6">{t({ mr: 'उत्पादने पाहा', en: 'Explore Products' })}</Link>
              </div>
            ) : stage === 'list' ? (
              <>
                <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li key={it.slug} layout exit={{ opacity: 0, x: 40 }} className="flex gap-4 py-4">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                          <Image src={media(it.image)} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <Link href={`/products/${it.slug}`} onClick={() => setOpen(false)} className="font-display text-[1.1rem] leading-snug text-wood">{t(it.name)}</Link>
                          {typeof it.price === 'number' && (
                            <p className="text-[.88rem] text-sandal">
                              {rupees(it.price)} × {it.qty} = <b className="font-semibold text-wood">{rupees(it.price * it.qty)}</b>
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-charcoal/15">
                              <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => setQty(it.slug, it.qty - 1)} aria-label={t({ mr: 'कमी करा', en: 'Decrease' })}>−</button>
                              <span className="w-8 text-center tabular-nums" aria-live="polite">{it.qty}</span>
                              <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => setQty(it.slug, it.qty + 1)} aria-label={t({ mr: 'वाढवा', en: 'Increase' })}>+</button>
                            </div>
                            <button type="button" onClick={() => remove(it.slug)} className="text-[.82rem] text-stone underline-offset-2 hover:underline">{t({ mr: 'काढा', en: 'Remove' })}</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-charcoal/10 p-5">
                  {priced && (
                    <p className="mb-2 flex items-baseline justify-between font-display text-[1.25rem] text-wood">
                      <span>{t({ mr: 'अंदाजे एकूण', en: 'Estimated total' })}</span>
                      <span className="tabular-nums">{rupees(total)}</span>
                    </p>
                  )}
                  <p className="text-[.85rem] text-stone">{t({ mr: 'अंतिम किंमत, पॅक साइज व डिलिव्हरी आम्ही फोन / WhatsApp वर कळवू.', en: 'We confirm the final price, pack size and delivery by phone or WhatsApp.' })}</p>
                  <button type="button" onClick={() => setStage('details')} className="btn-primary mt-4 w-full">{t({ mr: 'पुढे: तुमची माहिती', en: 'Next: your details' })} →</button>
                </div>
              </>
            ) : (
              <form onSubmit={send} className="flex flex-1 flex-col overflow-y-auto p-5" noValidate>
                <button type="button" onClick={() => setStage('list')} className="mb-4 self-start text-[.9rem] text-wood">← {t({ mr: 'यादीकडे परत', en: 'Back to list' })}</button>
                <div className="grid gap-4">
                  <label className="field">{t({ mr: 'पूर्ण नाव', en: 'Full name' })}<input name="name" required autoComplete="name" className="input" />{errors.name && <span className="text-[.8rem] text-red-700">{errors.name}</span>}</label>
                  <label className="field">{t({ mr: 'मोबाईल नंबर', en: 'Mobile number' })}<input name="mobile" required inputMode="numeric" autoComplete="tel" maxLength={13} className="input" placeholder={t({ mr: '10 अंकी नंबर', en: '10-digit number' })} />{errors.mobile && <span className="text-[.8rem] text-red-700">{errors.mobile}</span>}</label>
                  <label className="field">{t({ mr: 'पत्ता / गाव', en: 'Address / town' })}<input name="city" autoComplete="address-level2" className="input" /></label>
                  <label className="field">{t({ mr: 'टीप (ऐच्छिक)', en: 'Note (optional)' })}<textarea name="message" rows={3} className="input" /></label>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                </div>
                <div className="mt-auto pt-6">
                  <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? t({ mr: 'पाठवत आहे…', en: 'Sending…' }) : t({ mr: 'WhatsApp वर ऑर्डर पाठवा', en: 'Send order on WhatsApp' })}</button>
                  <p className="mt-3 text-center text-[.8rem] text-stone">
                    {t({ mr: 'किंवा कॉल करा', en: 'Or call' })} <a href={`tel:${site.phones[0]?.tel}`} className="font-semibold text-wood">{site.phones[0]?.display}</a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
