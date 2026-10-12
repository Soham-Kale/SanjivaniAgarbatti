'use client';

import { useState } from 'react';
import { adminFetch, setToken } from '@/lib/admin/api';
import { Notice, PageTitle, Panel, TextInput } from '@/components/admin/ui';

export default function AccountPage() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== again) return setMsg({ kind: 'error', text: 'नवीन पासवर्ड जुळत नाहीत · The new passwords do not match' });
    try {
      const { token } = await adminFetch<{ token: string }>('/api/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword: current, newPassword: next }) });
      setToken(token);
      setCurrent('');
      setNext('');
      setAgain('');
      setMsg({ kind: 'ok', text: 'पासवर्ड बदलला. इतर सर्व ठिकाणी लॉगआउट झाले. · Password changed; other sessions were signed out.' });
    } catch (err) {
      setMsg({ kind: 'error', text: (err as Error).message });
    }
  }

  return (
    <>
      <PageTitle mr="खाते" en="Account" />
      <form onSubmit={submit} className="max-w-lg">
        <Panel title="पासवर्ड बदला · Change password">
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
          <TextInput label={{ mr: 'सध्याचा पासवर्ड', en: 'Current password' }} type="password" autoComplete="current-password" value={current} onChange={setCurrent} />
          <TextInput label={{ mr: 'नवीन पासवर्ड', en: 'New password', hint: 'At least 10 characters' }} type="password" autoComplete="new-password" value={next} onChange={setNext} />
          <TextInput label={{ mr: 'नवीन पासवर्ड पुन्हा', en: 'New password again' }} type="password" autoComplete="new-password" value={again} onChange={setAgain} />
          <button type="submit" className="btn-primary justify-self-start">बदला · Change password</button>
        </Panel>
      </form>
    </>
  );
}
