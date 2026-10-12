'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin/api';
import { ENQUIRY_LABEL, STATUS_LABEL, type Enquiry } from '@/lib/admin/types';
import { Notice, PageTitle, Panel } from '@/components/admin/ui';

type Stats = { products: number; hidden: number; priced: number; newEnquiries: number; byType: Record<string, number>; recent: Enquiry[] };

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    adminFetch<Stats>('/api/admin/stats').then(setS).catch((e) => setError(e.message));
  }, []);

  const tiles = s
    ? [
        { n: s.products, mr: 'वेबसाइटवरील उत्पादने', en: 'Products on the website', href: '/admin/products' },
        { n: `${s.priced}/${s.products}`, mr: 'किंमत लावलेली', en: 'Products with a price', href: '/admin/products' },
        { n: s.hidden, mr: 'लपवलेली उत्पादने', en: 'Hidden products', href: '/admin/products?show=hidden' },
        { n: s.newEnquiries, mr: 'नवीन ऑर्डर / चौकशी', en: 'New orders & enquiries', href: '/admin/enquiries?status=new' },
      ]
    : [];

  return (
    <>
      <PageTitle mr="डॅशबोर्ड" en="Dashboard" />
      {error && <Notice kind="error">{error}</Notice>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.mr} href={t.href} className="rounded-2xl border border-charcoal/10 bg-white/70 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <b className="block font-display text-[2.2rem] font-normal leading-none text-wood tabular-nums">{t.n}</b>
            <span className="mt-2 block text-[.9rem] text-charcoal">{t.mr}</span>
            <span className="text-[.78rem] text-stone">{t.en}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="नवीनतम चौकशी · Latest enquiries" actions={<Link href="/admin/enquiries" className="btn-link text-[.9rem]">सर्व पाहा →</Link>}>
          {s && s.recent.length === 0 && <p className="text-stone">अजून काही नाही · Nothing yet.</p>}
          <ul className="divide-y divide-charcoal/10">
            {s?.recent.map((e) => (
              <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <b className="font-semibold">{e.name}</b> <span className="text-stone">· {e.mobile}</span>
                  <div className="text-[.8rem] text-stone">
                    {ENQUIRY_LABEL[e.type]} · {new Date(e.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[.75rem] font-semibold ${e.status === 'new' ? 'bg-maroon/10 text-maroon' : 'bg-charcoal/5 text-stone'}`}>{STATUS_LABEL[e.status]}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="पटकन करा · Quick actions">
          <div className="grid gap-3">
            <Link href="/admin/products/new" className="btn-primary">+ नवीन उत्पादन · Add product</Link>
            <Link href="/admin/products" className="btn-outline">किंमती बदला · Edit prices</Link>
            <Link href="/admin/content" className="btn-outline">वेबसाइट मजकूर · Edit website text</Link>
            <a href="/" target="_blank" rel="noopener" className="btn-link justify-center">वेबसाइट पाहा · View website ↗</a>
          </div>
        </Panel>
      </div>
    </>
  );
}
