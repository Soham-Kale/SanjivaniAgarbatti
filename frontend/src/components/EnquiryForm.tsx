'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { submitEnquiry } from '@/lib/api';
import { useContent, useWa } from '@/lib/content-context';
import type { EnquiryType, I18n } from '@/lib/types';

type State = 'idle' | 'sending' | 'done' | 'error' | 'offline';

const L = {
  name: { mr: 'पूर्ण नाव', en: 'Full name' },
  mobile: { mr: 'मोबाईल नंबर', en: 'Mobile number' },
  city: { mr: 'गाव / जिल्हा', en: 'Town / District' },
  plan: { mr: 'प्लॅन', en: 'Plan' },
  hasShop: { mr: 'स्वतःचे दुकान आहे का?', en: 'Do you have a shop?' },
  investment: { mr: 'गुंतवणूक क्षमता', en: 'Investment capacity' },
  shopName: { mr: 'दुकान / फर्मचे नाव', en: 'Shop / firm name' },
  businessType: { mr: 'व्यवसाय प्रकार', en: 'Business type' },
  products: { mr: 'कोणती उत्पादने हवी?', en: 'Products needed' },
  message: { mr: 'संदेश', en: 'Message' },
} satisfies Record<string, I18n>;

export default function EnquiryForm({ type, defaultPlan = 'franchise' }: { type: EnquiryType; defaultPlan?: string }) {
  const { t } = useLang();
  const { site, franchise } = useContent();
  const waLink = useWa();
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [waText, setWaText] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setErrors({});
    setState('sending');
    const r = await submitEnquiry(type, body);
    if (r.ok) {
      setState('done');
      form.reset();
      return;
    }
    if (r.fields) {
      setErrors(r.fields);
      setState('error');
      return;
    }
    // API not reachable: hand the same details to WhatsApp so the lead is not lost.
    const label = type === 'franchise' ? 'फ्रँचायझी चौकशी' : type === 'dealer' ? 'डीलर चौकशी' : 'चौकशी';
    const lines = Object.entries(body)
      .filter(([k, v]) => v && k !== 'website')
      .map(([k, v]) => `${(L as Record<string, I18n>)[k]?.mr ?? k}: ${v}`);
    setWaText([label, ...lines].join('\n'));
    setState('offline');
  }

  const err = (k: string) => errors[k] && <span className="text-[.8rem] text-red-700">{errors[k]}</span>;

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5 sm:grid-cols-2" noValidate>
      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="field">
        {t(L.name)}
        <input name="name" required minLength={2} className="input" placeholder={t({ mr: 'उदा. राहुल पाटील', en: 'e.g. Rahul Patil' })} />
        {err('name')}
      </label>
      <label className="field">
        {t(L.mobile)}
        <input name="mobile" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} className="input" placeholder={t({ mr: '10 अंकी नंबर', en: '10-digit number' })} />
        {err('mobile')}
      </label>
      <label className="field">
        {t(L.city)}
        <input name="city" required={type !== 'contact'} className="input" placeholder={t({ mr: 'उदा. पंढरपूर, सोलापूर', en: 'e.g. Pandharpur, Solapur' })} />
        {err('city')}
      </label>

      {type === 'franchise' && (
        <>
          <label className="field">
            {t(L.plan)}
            <select name="plan" defaultValue={defaultPlan} className="input">
              {franchise.plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {t(p.name)} · {p.amount}
                </option>
              ))}
            </select>
            {err('plan')}
          </label>
          <label className="field">
            {t(L.hasShop)}
            <select name="hasShop" className="input">
              <option value="हो">{t({ mr: 'हो', en: 'Yes' })}</option>
              <option value="नाही, भाड्याने घेणार">{t({ mr: 'नाही, भाड्याने घेणार', en: 'No, will rent one' })}</option>
              <option value="अजून ठरवले नाही">{t({ mr: 'अजून ठरवले नाही', en: 'Not decided yet' })}</option>
            </select>
          </label>
          <label className="field">
            {t(L.investment)}
            <select name="investment" className="input">
              <option value="₹2-5 लाख">₹2–5 {t({ mr: 'लाख', en: 'lakh' })}</option>
              <option value="₹5-15 लाख">₹5–15 {t({ mr: 'लाख', en: 'lakh' })}</option>
              <option value="₹15 लाख+">₹15 {t({ mr: 'लाख+', en: 'lakh+' })}</option>
            </select>
          </label>
        </>
      )}

      {type === 'dealer' && (
        <>
          <label className="field">
            {t(L.shopName)}
            <input name="shopName" className="input" placeholder={t({ mr: 'उदा. श्री गणेश जनरल स्टोअर्स', en: 'e.g. Shree Ganesh General Stores' })} />
          </label>
          <label className="field">
            {t(L.businessType)}
            <select name="businessType" className="input">
              <option value="किराणा / जनरल स्टोअर">{t({ mr: 'किराणा / जनरल स्टोअर', en: 'Kirana / general store' })}</option>
              <option value="पूजा साहित्य दुकान">{t({ mr: 'पूजा साहित्य दुकान', en: 'Puja sahitya shop' })}</option>
              <option value="होलसेलर / वितरक">{t({ mr: 'होलसेलर / वितरक', en: 'Wholesaler / distributor' })}</option>
              <option value="मंदिर / संस्था">{t({ mr: 'मंदिर / संस्था', en: 'Temple / institution' })}</option>
              <option value="इतर">{t({ mr: 'इतर', en: 'Other' })}</option>
            </select>
          </label>
          <label className="field sm:col-span-2">
            {t(L.products)}
            <input name="products" className="input" placeholder={t({ mr: 'उदा. अगरबत्ती पॅकेट, धूप जार, कप धूप', en: 'e.g. agarbatti packets, dhoop jars, cup dhoop' })} />
          </label>
        </>
      )}

      <label className="field sm:col-span-2">
        {t(L.message)}
        <textarea name="message" rows={3} className="input" placeholder={t({ mr: 'काही प्रश्न असल्यास लिहा', en: 'Write any questions here' })} />
      </label>

      <div className="flex flex-wrap items-center gap-3.5 sm:col-span-2">
        <button className="btn-primary disabled:opacity-60" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t({ mr: 'पाठवत आहे…', en: 'Sending…' }) : t({ mr: 'चौकशी पाठवा', en: 'Send enquiry' })}
        </button>
        <span role="status" className="min-h-[1.4em] text-[.95rem] text-gold-deep">
          {state === 'done' && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t({ mr: 'धन्यवाद! आमची टीम लवकरच तुमच्याशी संपर्क करेल.', en: 'Thank you! Our team will contact you soon.' })}
            </motion.span>
          )}
          {state === 'error' && t({ mr: 'कृपया लाल रंगातील माहिती तपासा.', en: 'Please check the fields marked in red.' })}
          {state === 'offline' && (
            <a href={waLink(waText)} target="_blank" rel="noopener" className="underline">
              {t({ mr: 'सर्व्हर उपलब्ध नाही. ही चौकशी WhatsApp वर पाठवा →', en: 'Server unavailable. Send this enquiry on WhatsApp →' })}
            </a>
          )}
        </span>
      </div>
      <p className="text-[.8rem] text-stone sm:col-span-2">
        {t({ mr: 'किंवा थेट कॉल करा:', en: 'Or call directly:' })}{' '}
        <a href={`tel:${site.phones[0]?.tel}`} className="text-charcoal">{site.phones[0]?.display}</a>
      </p>
    </form>
  );
}
