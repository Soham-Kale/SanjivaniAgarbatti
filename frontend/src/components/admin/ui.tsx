'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { media } from '@/lib/media';
import { uploadImages } from '@/lib/admin/api';
import type { I18n } from '@/lib/types';

/* Small form kit shared by the admin pages. Labels are bilingual: Marathi first, English after. */

export function Label({ mr, en, hint }: { mr: string; en: string; hint?: string }) {
  return (
    <span className="block text-[.88rem] font-semibold text-charcoal">
      {mr} <span className="font-normal text-stone">· {en}</span>
      {hint && <span className="mt-0.5 block text-[.78rem] font-normal text-stone">{hint}</span>}
    </span>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  long = false,
  type = 'text',
  error,
  ...rest
}: {
  label: { mr: string; en: string; hint?: string };
  value: string | number | null | undefined;
  onChange: (v: string) => void;
  long?: boolean;
  type?: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <label className="grid gap-1.5">
      <Label {...label} />
      {long ? (
        <textarea className="input min-h-[96px]" value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <input className="input" type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
      )}
      {error && <span className="text-[.8rem] text-red-700">{error}</span>}
    </label>
  );
}

/** Marathi + English pair. */
export function I18nInput({
  label,
  value,
  onChange,
  long = false,
  error,
}: {
  label: { mr: string; en: string; hint?: string };
  value: I18n | null | undefined;
  onChange: (v: I18n) => void;
  long?: boolean;
  error?: string;
}) {
  const v = value || { mr: '', en: '' };
  const Field = long ? 'textarea' : 'input';
  return (
    <fieldset className="grid gap-1.5">
      {label.mr && (
        <legend className="mb-1.5">
          <Label {...label} />
        </legend>
      )}
      <div className="grid gap-2 md:grid-cols-2">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-2 text-[.68rem] font-bold uppercase tracking-wider text-gold-deep">मराठी</span>
          <Field className={`input pt-6 ${long ? 'min-h-[110px]' : ''}`} value={v.mr} onChange={(e) => onChange({ ...v, mr: e.target.value })} lang="mr" />
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-2 text-[.68rem] font-bold uppercase tracking-wider text-stone">English</span>
          <Field className={`input pt-6 ${long ? 'min-h-[110px]' : ''}`} value={v.en} onChange={(e) => onChange({ ...v, en: e.target.value })} lang="en" />
        </div>
      </div>
      {error && <span className="text-[.8rem] text-red-700">{error}</span>}
    </fieldset>
  );
}

export function Toggle({ label, checked, onChange }: { label: { mr: string; en: string; hint?: string }; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" className="mt-1 h-5 w-5 accent-[#3B2416]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <Label {...label} />
    </label>
  );
}

/** Shows the current image and lets the admin upload a replacement. */
export function ImageInput({
  label,
  value,
  onChange,
  error,
}: {
  label: { mr: string; en: string; hint?: string };
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr('');
    try {
      const [url] = await uploadImages(files);
      onChange(url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }
  return (
    <div className="grid gap-1.5">
      <Label {...label} />
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-charcoal/10 bg-sand">
          {value ? <Image unoptimized src={media(value)} alt="" fill sizes="80px" className="object-cover" /> : <span className="grid h-full place-items-center text-[.75rem] text-stone">—</span>}
        </div>
        <div className="grid gap-2">
          <button type="button" className="btn-outline px-4 py-2 text-[.88rem]" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : 'फोटो बदला · Upload photo'}
          </button>
          <span className="text-[.75rem] text-stone">JPG, PNG, WebP · max 5 MB</span>
        </div>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => pick(e.target.files)} />
      </div>
      {(err || error) && <span className="text-[.8rem] text-red-700">{err || error}</span>}
    </div>
  );
}

/** Several images with add / remove / reorder. */
export function GalleryInput({ label, value, onChange }: { label: { mr: string; en: string; hint?: string }; value: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr('');
    try {
      onChange([...value, ...(await uploadImages(files))]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }
  const move = (i: number, d: number) => {
    const next = [...value];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };
  return (
    <div className="grid gap-2">
      <Label {...label} />
      <ul className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <li key={src + i} className="relative h-28 w-24 overflow-hidden rounded-xl border border-charcoal/10 bg-sand">
            <Image unoptimized src={media(src)} alt="" fill sizes="96px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-wood-night/70 text-[.8rem] text-ivory">
              <button type="button" className="px-2 py-1 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move left">←</button>
              <button type="button" className="px-2 py-1" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
              <button type="button" className="px-2 py-1 disabled:opacity-30" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move right">→</button>
            </div>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="grid h-28 w-24 place-items-center rounded-xl border-2 border-dashed border-charcoal/20 text-[.8rem] text-stone hover:border-wood hover:text-wood">
            {busy ? '…' : '+ फोटो'}
          </button>
        </li>
      </ul>
      <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => pick(e.target.files)} />
      {err && <span className="text-[.8rem] text-red-700">{err}</span>}
    </div>
  );
}

export function Panel({ title, children, actions }: { title?: React.ReactNode; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white/70 p-5 shadow-card sm:p-6">
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-display text-[1.35rem] text-wood">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'ok' | 'error'; children: React.ReactNode }) {
  const cls = kind === 'ok' ? 'border-green-700/30 bg-green-50 text-green-900' : kind === 'error' ? 'border-red-700/30 bg-red-50 text-red-900' : 'border-gold/40 bg-sand/60 text-charcoal';
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-[.92rem] ${cls}`}>
      {children}
    </div>
  );
}

export function PageTitle({ mr, en, children }: { mr: string; en: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[clamp(1.7rem,3vw,2.3rem)] text-wood">{mr}</h1>
        <p className="text-[.9rem] text-stone">{en}</p>
      </div>
      {children}
    </div>
  );
}
