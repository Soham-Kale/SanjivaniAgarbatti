'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { adminFetch, refreshSite } from '@/lib/admin/api';
import { CATEGORIES } from '@/lib/site';
import { media } from '@/lib/media';
import { rupees } from '@/lib/price';
import type { AdminProduct } from '@/lib/admin/types';
import { Notice, PageTitle } from '@/components/admin/ui';

function ProductsList() {
  const params = useSearchParams();
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [show, setShow] = useState(params?.get('show') === 'hidden' ? 'hidden' : 'all');
  // quick price edits, keyed by slug
  const [edits, setEdits] = useState<Record<string, { price: string; mrp: string }>>({});

  const load = () =>
    adminFetch<{ items: AdminProduct[] }>('/api/admin/products')
      .then((d) => setItems(d.items))
      .catch((e) => setMsg({ kind: 'error', text: e.message }))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const list = useMemo(
    () =>
      items.filter(
        (p) =>
          (cat === 'all' || p.category === cat) &&
          (show === 'all' || (show === 'hidden' ? !p.active : p.active)) &&
          (!q || `${p.name.mr} ${p.name.en} ${p.slug}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [items, cat, show, q]
  );

  async function act(p: AdminProduct, action: 'hide' | 'show' | 'delete') {
    if (action === 'delete' && !confirm(`"${p.name.mr}" कायमचे हटवायचे? हे परत आणता येणार नाही.\nDelete "${p.name.en || p.slug}" permanently? This cannot be undone.`)) return;
    try {
      if (action === 'show') await adminFetch(`/api/admin/products/${p.slug}`, { method: 'PUT', body: JSON.stringify({ active: true }) });
      else await adminFetch(`/api/admin/products/${p.slug}${action === 'delete' ? '?permanent=true' : ''}`, { method: 'DELETE' });
      setMsg({ kind: 'ok', text: action === 'delete' ? 'उत्पादन हटवले · Product deleted' : action === 'hide' ? 'वेबसाइटवरून लपवले · Hidden from the website' : 'वेबसाइटवर दाखवले · Shown on the website' });
      await load();
      await refreshSite();
    } catch (e) {
      setMsg({ kind: 'error', text: (e as Error).message });
    }
  }

  async function savePrice(p: AdminProduct) {
    const e = edits[p.slug];
    if (!e) return;
    try {
      await adminFetch(`/api/admin/products/${p.slug}`, { method: 'PUT', body: JSON.stringify({ price: e.price, mrp: e.mrp }) });
      setEdits(({ [p.slug]: _, ...rest }) => rest);
      setMsg({ kind: 'ok', text: `${p.name.mr}: किंमत जतन केली · Price saved` });
      await load();
      await refreshSite();
    } catch (err) {
      const fields = (err as { fields?: Record<string, string> }).fields;
      setMsg({ kind: 'error', text: fields ? Object.values(fields).join(', ') : (err as Error).message });
    }
  }

  return (
    <>
      <PageTitle mr="उत्पादने व किंमती" en="Products & prices">
        <Link href="/admin/products/new" className="btn-primary">+ नवीन उत्पादन · Add product</Link>
      </PageTitle>
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input className="input" placeholder="शोधा · Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label.mr} · {c.label.en}</option>
          ))}
        </select>
        <select className="input" value={show} onChange={(e) => setShow(e.target.value)} aria-label="Status">
          <option value="all">सर्व · All</option>
          <option value="active">दिसणारी · Visible</option>
          <option value="hidden">लपवलेली · Hidden</option>
        </select>
      </div>
      <p className="mb-3 text-[.85rem] text-stone">
        {loading ? 'Loading…' : `${list.length} उत्पादने · products`} · किंमत रिकामी ठेवल्यास वेबसाइटवर “किंमत चौकशीवर” दिसते.
      </p>

      <ul className="grid gap-3">
        {list.map((p) => {
          const e = edits[p.slug] ?? { price: p.price?.toString() ?? '', mrp: p.mrp?.toString() ?? '' };
          const dirty = Boolean(edits[p.slug]);
          return (
            <li key={p.slug} className={`grid items-center gap-4 rounded-2xl border border-charcoal/10 bg-white/70 p-3 shadow-card sm:grid-cols-[64px_1fr_auto] ${p.active ? '' : 'opacity-60'}`}>
              <div className="relative hidden h-20 w-16 overflow-hidden rounded-xl bg-sand sm:block">
                <Image unoptimized src={media(p.image)} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/admin/products/${p.slug}`} className="font-display text-[1.15rem] text-wood hover:underline">{p.name.mr}</Link>
                <div className="truncate text-[.8rem] text-stone">
                  {p.name.en} · {CATEGORIES.find((c) => c.id === p.category)?.label.mr} · /{p.slug}
                  {!p.active && <b className="ml-2 text-maroon">लपवलेले · Hidden</b>}
                  {p.inStock === false && <b className="ml-2 text-maroon">स्टॉक नाही</b>}
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  <label className="grid text-[.72rem] text-stone">
                    किंमत ₹ · Price
                    <input className="input w-28 py-2" inputMode="decimal" value={e.price} onChange={(ev) => setEdits((m) => ({ ...m, [p.slug]: { ...e, price: ev.target.value } }))} />
                  </label>
                  <label className="grid text-[.72rem] text-stone">
                    MRP ₹
                    <input className="input w-28 py-2" inputMode="decimal" value={e.mrp} onChange={(ev) => setEdits((m) => ({ ...m, [p.slug]: { ...e, mrp: ev.target.value } }))} />
                  </label>
                  {dirty ? (
                    <button type="button" className="btn-primary px-4 py-2 text-[.85rem]" onClick={() => savePrice(p)}>जतन · Save</button>
                  ) : (
                    <span className="pb-2 text-[.82rem] text-stone">{p.price != null ? rupees(p.price) : 'किंमत नाही · No price'}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                <Link href={`/admin/products/${p.slug}`} className="btn-outline px-4 py-2 text-[.85rem]">संपादन · Edit</Link>
                {p.active ? (
                  <button type="button" className="btn-outline px-4 py-2 text-[.85rem]" onClick={() => act(p, 'hide')}>लपवा · Hide</button>
                ) : (
                  <button type="button" className="btn-outline px-4 py-2 text-[.85rem]" onClick={() => act(p, 'show')}>दाखवा · Show</button>
                )}
                <button type="button" className="rounded-full px-4 py-2 text-[.85rem] font-semibold text-red-700 hover:bg-red-50" onClick={() => act(p, 'delete')}>हटवा · Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsList />
    </Suspense>
  );
}
