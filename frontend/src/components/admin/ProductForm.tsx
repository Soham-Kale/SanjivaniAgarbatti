'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminFetch, refreshSite, type ApiError } from '@/lib/admin/api';
import { CATEGORIES } from '@/lib/site';
import { FRAGRANCE_NAMES } from '@/lib/fragrances';
import type { AdminProduct } from '@/lib/admin/types';
import { GalleryInput, I18nInput, ImageInput, Label, Notice, PageTitle, Panel, TextInput, Toggle } from './ui';

const SUBTYPES = [
  { id: 'pouch', label: 'पाऊच · Pouch' },
  { id: 'packet', label: 'लांब पॅकेट · Long packet' },
  { id: 'jar', label: 'जार · Jar' },
  { id: 'box', label: 'बॉक्स · Box' },
  { id: 'pack', label: 'पॅक · Pack' },
];

const EMPTY: AdminProduct = {
  slug: '',
  category: 'daily',
  subtype: 'pouch',
  name: { mr: '', en: '' },
  tagline: { mr: '', en: '' },
  description: { mr: '', en: '' },
  uses: { mr: '', en: '' },
  fragrance: null,
  benefits: [],
  image: '',
  gallery: [],
  priceNote: null,
  price: null,
  mrp: null,
  packSize: { mr: '', en: '' },
  inStock: true,
  featured: false,
  active: true,
  sort: 0,
};

export default function ProductForm({ initial }: { initial?: AdminProduct }) {
  const router = useRouter();
  const isNew = !initial;
  const [p, setP] = useState<AdminProduct>(() => ({ ...EMPTY, ...initial }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((x) => ({ ...x, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMsg(null);
    try {
      const body = JSON.stringify({ ...p, benefits: p.benefits.filter(Boolean) });
      const { item } = isNew
        ? await adminFetch<{ item: AdminProduct }>('/api/admin/products', { method: 'POST', body })
        : await adminFetch<{ item: AdminProduct }>(`/api/admin/products/${initial!.slug}`, { method: 'PUT', body });
      await refreshSite();
      if (isNew || item.slug !== initial!.slug) {
        router.replace(`/admin/products/${item.slug}?saved=1`);
      } else {
        setP({ ...EMPTY, ...item });
        setMsg({ kind: 'ok', text: 'जतन केले. वेबसाइटवर लगेच दिसेल. · Saved. It now shows on the website.' });
      }
    } catch (err) {
      const fields = (err as ApiError).fields;
      if (fields) setErrors(fields);
      setMsg({ kind: 'error', text: fields ? 'खालील चुका दुरुस्त करा · Please fix the fields marked below.' : (err as Error).message });
    } finally {
      setBusy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <form onSubmit={save} noValidate>
      <PageTitle mr={isNew ? 'नवीन उत्पादन' : p.name.mr || 'उत्पादन'} en={isNew ? 'Add product' : `Edit product · /products/${initial!.slug}`}>
        <div className="flex flex-wrap gap-2">
          {!isNew && (
            <a href={`/products/${initial!.slug}`} target="_blank" rel="noopener" className="btn-outline">
              वेबसाइटवर पाहा ↗
            </a>
          )}
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? '…' : 'जतन करा · Save'}</button>
        </div>
      </PageTitle>
      {msg && (
        <div className="mb-5">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid content-start gap-6">
          <Panel title="माहिती · Details">
            <I18nInput label={{ mr: 'उत्पादनाचे नाव', en: 'Product name' }} value={p.name} onChange={(v) => set('name', v)} error={errors.name} />
            <I18nInput label={{ mr: 'छोटी ओळ', en: 'Tagline', hint: 'Shown above the name, e.g. “गोल्ड-कॅप जार”' }} value={p.tagline} onChange={(v) => set('tagline', v)} />
            <I18nInput long label={{ mr: 'वर्णन', en: 'Description' }} value={p.description} onChange={(v) => set('description', v)} />
            <I18nInput long label={{ mr: 'कशासाठी वापरतात?', en: 'What is it for?', hint: 'Shown on product cards and the product page' }} value={p.uses} onChange={(v) => set('uses', v)} />
            <div className="grid gap-2">
              <Label mr="वैशिष्ट्ये (एका ओळीत एक)" en="Highlights (one per line)" />
              <textarea className="input min-h-[120px]" value={p.benefits.join('\n')} onChange={(e) => set('benefits', e.target.value.split('\n'))} />
            </div>
          </Panel>

          <Panel title="फोटो · Photos">
            <ImageInput label={{ mr: 'मुख्य फोटो', en: 'Main photo' }} value={p.image} onChange={(v) => set('image', v)} error={errors.image} />
            <GalleryInput label={{ mr: 'आणखी फोटो', en: 'More photos (gallery)' }} value={p.gallery} onChange={(v) => set('gallery', v)} />
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel title="किंमत · Price">
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={{ mr: 'विक्री किंमत ₹', en: 'Selling price' }} inputMode="decimal" value={p.price ?? ''} onChange={(v) => set('price', (v === '' ? null : v) as unknown as number)} error={errors.price} />
              <TextInput label={{ mr: 'MRP ₹', en: 'MRP (optional)' }} inputMode="decimal" value={p.mrp ?? ''} onChange={(v) => set('mrp', (v === '' ? null : v) as unknown as number)} error={errors.mrp} />
            </div>
            <I18nInput label={{ mr: 'पॅक साइज', en: 'Pack size', hint: 'e.g. १०० काड्या / 100 sticks' }} value={p.packSize} onChange={(v) => set('packSize', v)} />
            <I18nInput
              label={{ mr: 'किंमत टीप', en: 'Price note', hint: 'Shown when no price is set, e.g. ₹५ / ₹१० पॅक' }}
              value={p.priceNote}
              onChange={(v) => set('priceNote', v.mr || v.en ? v : null)}
            />
            <Toggle label={{ mr: 'स्टॉकमध्ये आहे', en: 'In stock' }} checked={p.inStock !== false} onChange={(v) => set('inStock', v)} />
          </Panel>

          <Panel title="श्रेणी · Category">
            <label className="grid gap-1.5">
              <Label mr="श्रेणी" en="Category" />
              <select className="input" value={p.category} onChange={(e) => set('category', e.target.value as AdminProduct['category'])}>
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label.mr} · {c.label.en}</option>
                ))}
              </select>
              {errors.category && <span className="text-[.8rem] text-red-700">{errors.category}</span>}
            </label>
            <label className="grid gap-1.5">
              <Label mr="पॅकिंग प्रकार" en="Packing" />
              <select className="input" value={p.subtype} onChange={(e) => set('subtype', e.target.value)}>
                {SUBTYPES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <Label mr="सुगंध" en="Fragrance (for the fragrance filter)" />
              <select className="input" value={p.fragrance ?? ''} onChange={(e) => set('fragrance', e.target.value || null)}>
                <option value="">— नाही · None —</option>
                {Object.entries(FRAGRANCE_NAMES).map(([id, n]) => (
                  <option key={id} value={id}>{n.mr} · {n.en}</option>
                ))}
              </select>
            </label>
          </Panel>

          <Panel title="वेबसाइटवर · On the website">
            <Toggle label={{ mr: 'वेबसाइटवर दाखवा', en: 'Visible on the website' }} checked={p.active} onChange={(v) => set('active', v)} />
            <Toggle label={{ mr: 'मुख्य पानावर निवडक', en: 'Featured on the home page' }} checked={p.featured} onChange={(v) => set('featured', v)} />
            <TextInput label={{ mr: 'क्रम', en: 'Sort order', hint: 'Lower numbers show first' }} type="number" value={p.sort} onChange={(v) => set('sort', Number(v))} />
            <TextInput
              label={{ mr: 'वेब पत्ता (slug)', en: 'URL slug', hint: 'English letters and dashes. Leave empty to make one from the English name.' }}
              value={p.slug}
              onChange={(v) => set('slug', v)}
              error={errors.slug}
            />
          </Panel>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Link href="/admin/products" className="btn-outline">← सर्व उत्पादने · All products</Link>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? '…' : 'जतन करा · Save'}</button>
      </div>
    </form>
  );
}
