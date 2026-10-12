import { env } from './env';
import type { EnquiryKind } from './models';

/* Sends each website enquiry to the company inbox through Resend (https://resend.com). */

export const emailConfigured = () => Boolean(env.resend.apiKey && env.resend.to.length);

const TITLES: Record<EnquiryKind, string> = {
  franchise: 'Franchise enquiry',
  dealer: 'Dealer / distributor enquiry',
  contact: 'Contact message',
  order: 'Order list',
};

const LABELS: Record<string, string> = {
  name: 'Name',
  mobile: 'Mobile',
  city: 'City / district',
  plan: 'Plan',
  hasShop: 'Has a shop',
  investment: 'Investment',
  shopName: 'Shop name',
  businessType: 'Business type',
  products: 'Products',
  items: 'Items',
  message: 'Message',
};

const html = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type Item = { slug: string; name?: string; qty: number };

function rows(data: Record<string, unknown>) {
  return Object.entries(LABELS)
    .map(([k, label]) => {
      const v = data[k];
      const text = k === 'items' && Array.isArray(v) ? (v as Item[]).map((i) => `${i.name || i.slug} × ${i.qty}`).join('\n') : String(v ?? '');
      return text.trim() ? { label, text } : null;
    })
    .filter((r): r is { label: string; text: string } => r !== null);
}

/** Never throws: a failed email is logged and the enquiry is still saved. Returns true when sent. */
export async function sendEnquiryEmail(type: EnquiryKind, data: Record<string, unknown>) {
  if (!emailConfigured()) return false;
  const list = rows(data);
  const subject = `${TITLES[type]}: ${String(data.name || '')}${data.city ? `, ${String(data.city)}` : ''}`;
  const text = [`${TITLES[type]} from the website`, '', ...list.map((r) => `${r.label}: ${r.text}`)].join('\n');
  const body = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#1E1730">
<h2 style="margin:0 0 12px;color:#C2185B">${html(TITLES[type])}</h2>
<table cellpadding="6" style="border-collapse:collapse">${list
    .map((r) => `<tr><td style="color:#675C78;vertical-align:top;white-space:nowrap">${html(r.label)}</td><td style="white-space:pre-wrap">${html(r.text)}</td></tr>`)
    .join('')}</table>
<p style="color:#675C78;font-size:13px;margin-top:16px">Sent from the Sanjivani website. Reply on WhatsApp or call the mobile number above.</p></div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.resend.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.resend.from, to: env.resend.to, subject, text, html: body }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Enquiry email failed', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (e) {
    console.error('Enquiry email failed', e);
    return false;
  }
}
