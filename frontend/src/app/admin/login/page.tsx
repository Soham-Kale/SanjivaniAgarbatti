'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { login } from '@/lib/admin/api';
import { Notice } from '@/components/admin/ui';

function LoginForm() {
  const router = useRouter();
  const expired = useSearchParams()?.get('expired');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-charcoal/10 bg-white/80 p-7 shadow-lift">
      <p className="eyebrow">Sanjivani</p>
      <h1 className="mt-2 text-[2rem] text-wood">Admin लॉगिन</h1>
      <p className="text-[.9rem] text-stone">Sign in to manage products, prices and website content.</p>
      <div className="mt-6 grid gap-4">
        {expired && !error && <Notice>सत्र संपले, पुन्हा लॉगिन करा · Session expired, please sign in again.</Notice>}
        {error && <Notice kind="error">{error}</Notice>}
        <label className="field">
          ईमेल · Email
          <input className="input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          पासवर्ड · Password
          <input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={busy} className="btn-primary mt-2 w-full disabled:opacity-60">
          {busy ? '…' : 'लॉगिन करा · Sign in'}
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
