'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminFetch, getToken, logout } from '@/lib/admin/api';

const NAV = [
  { href: '/admin', mr: 'डॅशबोर्ड', en: 'Dashboard', icon: '◧' },
  { href: '/admin/products', mr: 'उत्पादने व किंमती', en: 'Products & prices', icon: '▦' },
  { href: '/admin/content', mr: 'वेबसाइट मजकूर', en: 'Website content', icon: '✎' },
  { href: '/admin/enquiries', mr: 'ऑर्डर व चौकशी', en: 'Orders & enquiries', icon: '✉' },
  { href: '/admin/account', mr: 'खाते', en: 'Account', icon: '⚿' },
];

/** Sign-in guard and sidebar layout for every /admin page except the login screen. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '/admin';
  const router = useRouter();
  const [me, setMe] = useState<{ email: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const isLogin = path.startsWith('/admin/login');

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) {
      router.replace('/admin/login');
      return;
    }
    adminFetch<{ admin: { email: string } }>('/api/auth/me')
      .then((d) => setMe(d.admin))
      .catch(() => router.replace('/admin/login'));
  }, [isLogin, router]);

  useEffect(() => setMenu(false), [path]);

  if (isLogin) return <div className="min-h-screen bg-ivory-2">{children}</div>;

  if (!me) return <div className="grid min-h-screen place-items-center text-stone">Loading…</div>;

  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

  return (
    <div className="min-h-screen bg-ivory-2 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-wood-night text-mist transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col p-5">
          <Link href="/admin" className="font-display text-[1.5rem] text-ivory">
            संजीवनी <span className="block text-[.72rem] font-body font-semibold uppercase tracking-[.2em] text-gold-light">Admin panel</span>
          </Link>
          <nav className="mt-8 grid gap-1" aria-label="Admin">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${active(n.href) ? 'bg-ivory/10 text-ivory' : 'hover:bg-ivory/5 hover:text-ivory'}`}>
                <span className="w-5 text-center text-gold-light" aria-hidden>{n.icon}</span>
                <span className="leading-tight">
                  {n.mr}
                  <span className="block text-[.75rem] opacity-70">{n.en}</span>
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-2 border-t border-ivory/10 pt-4 text-[.85rem]">
            <a href="/" target="_blank" rel="noopener" className="hover:text-ivory">वेबसाइट पाहा · View website ↗</a>
            <span className="truncate opacity-70">{me.email}</span>
            <button type="button" onClick={logout} className="btn-outline-light mt-1 py-2 text-[.88rem]">बाहेर पडा · Sign out</button>
          </div>
        </div>
      </aside>
      {menu && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal/10 bg-ivory/90 px-4 py-3 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15" aria-label="Open menu">☰</button>
          <span className="font-display text-[1.2rem] text-wood">Admin</span>
          <span className="w-11" />
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
