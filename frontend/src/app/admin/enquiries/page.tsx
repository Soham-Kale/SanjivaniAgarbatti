'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { adminFetch, getToken } from '@/lib/admin/api';
import { ENQUIRY_LABEL, STATUS_LABEL, type Enquiry } from '@/lib/admin/types';
import { Notice, PageTitle } from '@/components/admin/ui';

import { API_URL } from '@/lib/api-url';
const DETAIL: [keyof Enquiry, string][] = [
  ['city', 'गाव · City'],
  ['plan', 'प्लॅन · Plan'],
  ['hasShop', 'दुकान · Shop'],
  ['investment', 'गुंतवणूक · Investment'],
  ['shopName', 'दुकानाचे नाव · Shop name'],
  ['businessType', 'व्यवसाय · Business'],
  ['products', 'उत्पादने · Products'],
  ['message', 'संदेश · Message'],
];

function Enquiries() {
  const params = useSearchParams();
  const [type, setType] = useState(params?.get('type') || '');
  const [status, setStatus] = useState(params?.get('status') || '');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: Enquiry[]; total: number; limit: number } | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const q = new URLSearchParams({ page: String(page), limit: '25' });
    if (type) q.set('type', type);
    if (status) q.set('status', status);
    adminFetch<{ items: Enquiry[]; total: number; limit: number }>(`/api/admin/enquiries?${q}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [type, status, page]);
  useEffect(load, [load]);

  async function update(e: Enquiry, body: Partial<Enquiry>) {
    try {
      await adminFetch(`/api/admin/enquiries/${e._id}`, { method: 'PATCH', body: JSON.stringify(body) });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  async function remove(e: Enquiry) {
    if (!confirm(`${e.name} यांची चौकशी हटवायची? · Delete this enquiry?`)) return;
    try {
      await adminFetch(`/api/admin/enquiries/${e._id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  async function downloadCsv() {
    const res = await fetch(`${API_URL}/api/admin/enquiries.csv${type ? `?type=${type}` : ''}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (!res.ok) return setError('CSV download failed');
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement('a'), { href: url, download: 'sanjivani-enquiries.csv' });
    a.click();
    URL.revokeObjectURL(url);
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <>
      <PageTitle mr="ऑर्डर व चौकशी" en="Orders & enquiries from the website">
        <button type="button" onClick={downloadCsv} className="btn-outline">Excel / CSV ↓</button>
      </PageTitle>
      {error && (
        <div className="mb-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
        <select className="input" value={type} onChange={(e) => (setType(e.target.value), setPage(1))} aria-label="Type">
          <option value="">सर्व प्रकार · All types</option>
          {Object.entries(ENQUIRY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => (setStatus(e.target.value), setPage(1))} aria-label="Status">
          <option value="">सर्व स्थिती · All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {data && data.items.length === 0 && <p className="text-stone">काही नाही · Nothing here yet.</p>}
      <ul className="grid gap-3">
        {data?.items.map((e) => (
          <li key={e._id} className="rounded-2xl border border-charcoal/10 bg-white/70 p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[.75rem] font-semibold uppercase tracking-wider text-gold-deep">{ENQUIRY_LABEL[e.type]}</span>
                <h2 className="font-display text-[1.25rem] text-wood">{e.name}</h2>
                <div className="flex flex-wrap gap-x-4 text-[.9rem]">
                  <a href={`tel:${e.mobile}`} className="font-semibold text-wood hover:underline">{e.mobile}</a>
                  <a href={`https://wa.me/91${e.mobile}`} target="_blank" rel="noopener" className="text-green-800 hover:underline">WhatsApp ↗</a>
                  <span className="text-stone">{new Date(e.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <select className="input w-auto py-2" value={e.status} onChange={(ev) => update(e, { status: ev.target.value as Enquiry['status'] })} aria-label="Status">
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            {e.items && e.items.length > 0 && (
              <ul className="mt-3 rounded-xl bg-sand/60 p-3 text-[.92rem]">
                {e.items.map((it) => (
                  <li key={it.slug}>
                    {it.name} × <b>{it.qty}</b>
                  </li>
                ))}
              </ul>
            )}
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-[.9rem] sm:grid-cols-2">
              {DETAIL.filter(([k]) => e[k]).map(([k, l]) => (
                <div key={k} className={k === 'message' ? 'sm:col-span-2' : ''}>
                  <dt className="inline text-stone">{l}: </dt>
                  <dd className="inline">{String(e[k])}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <label className="grid flex-1 gap-1 text-[.8rem] text-stone">
                नोंद · Notes (only you see this)
                <input className="input py-2" defaultValue={e.notes || ''} onBlur={(ev) => ev.target.value !== (e.notes || '') && update(e, { notes: ev.target.value })} />
              </label>
              <button type="button" onClick={() => remove(e)} className="rounded-full px-4 py-2 text-[.85rem] font-semibold text-red-700 hover:bg-red-50">हटवा · Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" className="btn-outline px-4 py-2" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
          <span className="text-[.9rem] text-stone">{page} / {pages}</span>
          <button type="button" className="btn-outline px-4 py-2" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>→</button>
        </div>
      )}
    </>
  );
}

export default function EnquiriesPage() {
  return (
    <Suspense>
      <Enquiries />
    </Suspense>
  );
}
