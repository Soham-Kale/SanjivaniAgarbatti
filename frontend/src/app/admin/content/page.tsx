'use client';

import { useEffect, useState } from 'react';
import { adminFetch, refreshSite } from '@/lib/admin/api';
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from '@/lib/content';
import type { I18n } from '@/lib/types';
import { I18nInput, ImageInput, Label, Notice, PageTitle, Panel, TextInput, Toggle } from '@/components/admin/ui';

/**
 * Website content editor. Each section below maps to a part of the site; every field edits a
 * path inside SiteContent (see src/lib/content.ts). Saving stores the whole object in MongoDB.
 */
type Kind = 'text' | 'long' | 'i18n' | 'i18n-long' | 'image' | 'bool' | 'icon';
type Field =
  | { path: string; mr: string; en: string; hint?: string; kind: Kind }
  | { path: string; mr: string; en: string; hint?: string; kind: 'list'; of: Field[] | 'i18n'; fixed?: boolean; itemLabel: string; blank: unknown };

type Section = { id: string; mr: string; en: string; fields: Field[] };

const ICONS = ['clock', 'hand', 'smoke', 'flower', 'cup', 'store'];

const SECTIONS: Section[] = [
  {
    id: 'site',
    mr: 'संपर्क माहिती',
    en: 'Contact details',
    fields: [
      { path: 'site.name', mr: 'व्यवसायाचे नाव', en: 'Business name', kind: 'i18n' },
      { path: 'site.motto', mr: 'घोषवाक्य', en: 'Motto (footer)', kind: 'text' },
      { path: 'site.whatsapp', mr: 'WhatsApp नंबर', en: 'WhatsApp number', hint: 'With country code, digits only, e.g. 917387142494', kind: 'text' },
      { path: 'site.email', mr: 'ईमेल', en: 'Email', kind: 'text' },
      { path: 'site.address', mr: 'पत्ता', en: 'Address', kind: 'i18n-long' },
      { path: 'site.mapUrl', mr: 'Google Maps लिंक', en: 'Google Maps link', kind: 'text' },
      { path: 'site.hours', mr: 'वेळ', en: 'Opening hours', hint: 'Leave empty to hide', kind: 'i18n' },
      {
        path: 'site.phones',
        mr: 'फोन / संस्थापक',
        en: 'Phones / founders',
        hint: 'The first number is used for the call button. Founders with a photo appear on the About page.',
        kind: 'list',
        itemLabel: 'व्यक्ती · Person',
        blank: { display: '', tel: '', person: { mr: '', en: '' }, role: '', photo: '' },
        of: [
          { path: 'display', mr: 'दाखवायचा नंबर', en: 'Number as shown', hint: '+91 73871 42494', kind: 'text' },
          { path: 'tel', mr: 'कॉलसाठी नंबर', en: 'Number for calling', hint: '+917387142494', kind: 'text' },
          { path: 'person', mr: 'नाव', en: 'Name', kind: 'i18n' },
          { path: 'role', mr: 'पद', en: 'Role', kind: 'text' },
          { path: 'photo', mr: 'फोटो', en: 'Photo', kind: 'image' },
        ],
      },
    ],
  },
  {
    id: 'announcement',
    mr: 'सूचना पट्टी',
    en: 'Announcement bar',
    fields: [
      { path: 'announcement.enabled', mr: 'वरची सूचना दाखवा', en: 'Show the announcement bar at the top', kind: 'bool' },
      { path: 'announcement.text', mr: 'सूचना', en: 'Text', hint: 'e.g. दिवाळी ऑफर: सर्व धूप जारवर १०% सूट', kind: 'i18n' },
      { path: 'announcement.link', mr: 'लिंक (ऐच्छिक)', en: 'Link (optional)', hint: 'e.g. /products?c=dhoop', kind: 'text' },
    ],
  },
  {
    id: 'hero',
    mr: 'मुख्य पान: सुरुवात',
    en: 'Home: top banner',
    fields: [
      { path: 'hero.eyebrow', mr: 'वरची छोटी ओळ', en: 'Small line above the title', kind: 'i18n' },
      { path: 'hero.title', mr: 'मुख्य शीर्षक', en: 'Title', hint: 'Separate words with | . The second word is shown in gold.', kind: 'i18n' },
      { path: 'hero.tagline', mr: 'टॅगलाइन', en: 'Tagline', kind: 'text' },
      { path: 'hero.text', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
      { path: 'hero.ctaPrimary', mr: 'पहिले बटण', en: 'First button', kind: 'i18n' },
      { path: 'hero.ctaSecondary', mr: 'दुसरे बटण', en: 'Second button', kind: 'i18n' },
      { path: 'hero.poster', mr: 'फोटो (3D लोड होईपर्यंत)', en: 'Photo shown before the 3D loads', kind: 'image' },
    ],
  },
  {
    id: 'featured',
    mr: 'मुख्य पान: निवडक उत्पादने',
    en: 'Home: featured products',
    fields: [
      { path: 'featured.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'featured.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      { path: 'featured.text', mr: 'मजकूर', en: 'Text', hint: 'Choose which products appear with “Featured” on each product.', kind: 'i18n-long' },
    ],
  },
  {
    id: 'categories',
    mr: 'श्रेणी कार्ड्स',
    en: 'Category cards',
    fields: (['daily', 'premium', 'dhoop', 'cup', 'puja'] as const).flatMap((c) => [
      { path: `categories.${c}.label`, mr: `${DEFAULT_CONTENT.categories[c].label.mr}: नाव`, en: `${DEFAULT_CONTENT.categories[c].label.en}: name`, kind: 'i18n' as const },
      { path: `categories.${c}.blurb`, mr: 'छोटे वर्णन', en: 'Short description', kind: 'i18n' as const },
      { path: `categories.${c}.image`, mr: 'फोटो', en: 'Photo', kind: 'image' as const },
    ]),
  },
  {
    id: 'story',
    mr: 'आमची कथा',
    en: 'Our story',
    fields: [
      { path: 'story.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'story.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      {
        path: 'story.chapters',
        mr: 'भाग',
        en: 'Chapters',
        kind: 'list',
        itemLabel: 'भाग · Chapter',
        blank: { k: { mr: '', en: '' }, h: { mr: '', en: '' }, p: { mr: '', en: '' } },
        of: [
          { path: 'k', mr: 'क्रमांक ओळ', en: 'Label', kind: 'i18n' },
          { path: 'h', mr: 'शीर्षक', en: 'Heading', kind: 'i18n' },
          { path: 'p', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
        ],
      },
      {
        path: 'story.photos',
        mr: 'फोटो',
        en: 'Photos',
        hint: 'The first photo is shown large; the next two below it.',
        kind: 'list',
        itemLabel: 'फोटो · Photo',
        blank: { src: '', cap: { mr: '', en: '' } },
        of: [
          { path: 'src', mr: 'फोटो', en: 'Photo', kind: 'image' },
          { path: 'cap', mr: 'फोटो खालील ओळ', en: 'Caption', kind: 'i18n' },
        ],
      },
    ],
  },
  {
    id: 'why',
    mr: 'आम्हीच का?',
    en: 'Why us',
    fields: [
      { path: 'why.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'why.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      { path: 'why.text', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
      {
        path: 'why.items',
        mr: 'मुद्दे',
        en: 'Points',
        kind: 'list',
        itemLabel: 'मुद्दा · Point',
        blank: { icon: 'flower', b: { mr: '', en: '' }, s: { mr: '', en: '' } },
        of: [
          { path: 'icon', mr: 'चिन्ह', en: 'Icon', kind: 'icon' },
          { path: 'b', mr: 'शीर्षक', en: 'Heading', kind: 'i18n' },
          { path: 's', mr: 'मजकूर', en: 'Text', kind: 'i18n' },
        ],
      },
    ],
  },
  {
    id: 'franchise',
    mr: 'फ्रँचायझी',
    en: 'Franchise',
    fields: [
      { path: 'franchise.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'franchise.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      { path: 'franchise.text', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
      {
        path: 'franchise.plans',
        mr: 'प्लॅन',
        en: 'Plans',
        hint: 'The three plans are linked to the enquiry form, so they can be edited but not added or removed.',
        kind: 'list',
        fixed: true,
        itemLabel: 'प्लॅन · Plan',
        blank: null,
        of: [
          { path: 'name', mr: 'नाव', en: 'Name', kind: 'i18n' },
          { path: 'amount', mr: 'रक्कम', en: 'Amount', kind: 'text' },
          { path: 'deposit', mr: 'डिपॉझिट', en: 'Deposit', kind: 'i18n' },
          { path: 'points', mr: 'मुद्दे', en: 'Points', kind: 'list', of: 'i18n', itemLabel: 'मुद्दा', blank: { mr: '', en: '' } },
          { path: 'featured', mr: '“लोकप्रिय” दाखवा', en: 'Mark as popular', kind: 'bool' },
        ],
      },
      { path: 'franchise.steps', mr: 'प्रक्रियेचे टप्पे', en: 'Process steps', kind: 'list', of: 'i18n', itemLabel: 'टप्पा · Step', blank: { mr: '', en: '' } },
      { path: 'franchise.note', mr: 'टीप', en: 'Note', kind: 'i18n-long' },
    ],
  },
  {
    id: 'about',
    mr: 'आमच्याविषयी पान',
    en: 'About page',
    fields: [
      { path: 'about.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'about.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      { path: 'about.quote', mr: 'घोषवाक्य', en: 'Quote', kind: 'text' },
      { path: 'about.text', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
    ],
  },
  {
    id: 'closing',
    mr: 'मुख्य पान: शेवट',
    en: 'Home: closing banner',
    fields: [
      { path: 'closing.eyebrow', mr: 'छोटी ओळ', en: 'Small line', kind: 'i18n' },
      { path: 'closing.title', mr: 'शीर्षक', en: 'Title', kind: 'i18n' },
      { path: 'closing.highlight', mr: 'सोनेरी शब्द', en: 'Gold words', kind: 'i18n' },
      { path: 'closing.text', mr: 'मजकूर', en: 'Text', kind: 'i18n-long' },
    ],
  },
  {
    id: 'footer',
    mr: 'तळटीप व SEO',
    en: 'Footer & search engines',
    fields: [
      { path: 'footer.blurb', mr: 'तळटीप मजकूर', en: 'Footer text', kind: 'i18n-long' },
      { path: 'footer.note', mr: 'तळटीप सूचना', en: 'Footer note', kind: 'i18n' },
      { path: 'seo.title', mr: 'Google शीर्षक', en: 'Search title', kind: 'text' },
      { path: 'seo.description', mr: 'Google वर्णन', en: 'Search description', kind: 'long' },
    ],
  },
];

/* --- tiny path helpers --- */
type Obj = Record<string, unknown>;
const get = (o: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (v as Obj)?.[k], o);
function set<T>(o: T, path: string, value: unknown): T {
  const [k, ...rest] = path.split('.');
  const copy = (Array.isArray(o) ? [...o] : { ...(o as Obj) }) as Obj;
  copy[k] = rest.length ? set(copy[k], rest.join('.'), value) : value;
  return copy as T;
}

function FieldEditor({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const label = { mr: f.mr, en: f.en, hint: f.hint };
  switch (f.kind) {
    case 'text':
      return <TextInput label={label} value={(value as string) ?? ''} onChange={onChange} />;
    case 'long':
      return <TextInput long label={label} value={(value as string) ?? ''} onChange={onChange} />;
    case 'i18n':
      return <I18nInput label={label} value={value as I18n} onChange={onChange} />;
    case 'i18n-long':
      return <I18nInput long label={label} value={value as I18n} onChange={onChange} />;
    case 'image':
      return <ImageInput label={label} value={(value as string) ?? ''} onChange={onChange} />;
    case 'bool':
      return <Toggle label={label} checked={Boolean(value)} onChange={onChange} />;
    case 'icon':
      return (
        <label className="grid gap-1.5">
          <Label {...label} />
          <select className="input" value={(value as string) ?? 'flower'} onChange={(e) => onChange(e.target.value)}>
            {ICONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
      );
    case 'list': {
      const list = (Array.isArray(value) ? value : []) as unknown[];
      const update = (i: number, v: unknown) => onChange(list.map((x, k) => (k === i ? v : x)));
      const move = (i: number, d: number) => {
        const next = [...list];
        const [x] = next.splice(i, 1);
        next.splice(i + d, 0, x);
        onChange(next);
      };
      return (
        <div className="grid gap-3">
          <Label {...label} />
          {list.map((item, i) => (
            <div key={i} className="rounded-xl border border-charcoal/10 bg-ivory/60 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <b className="text-[.85rem] text-wood">
                  {f.itemLabel} {i + 1}
                </b>
                {!f.fixed && (
                  <div className="flex gap-1 text-[.8rem]">
                    <button type="button" className="rounded-full px-2.5 py-1 hover:bg-charcoal/5 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                    <button type="button" className="rounded-full px-2.5 py-1 hover:bg-charcoal/5 disabled:opacity-30" disabled={i === list.length - 1} onClick={() => move(i, 1)}>↓</button>
                    <button type="button" className="rounded-full px-2.5 py-1 text-red-700 hover:bg-red-50" onClick={() => onChange(list.filter((_, k) => k !== i))}>काढा · Remove</button>
                  </div>
                )}
              </div>
              {f.of === 'i18n' ? (
                <I18nInput label={{ mr: '', en: '' }} value={item as I18n} onChange={(v) => update(i, v)} />
              ) : (
                <div className="grid gap-4">
                  {f.of.map((sub) => (
                    <FieldEditor key={sub.path} f={sub} value={get(item, sub.path)} onChange={(v) => update(i, set(item, sub.path, v))} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {!f.fixed && (
            <button type="button" className="btn-outline justify-self-start px-4 py-2 text-[.88rem]" onClick={() => onChange([...list, structuredClone(f.blank)])}>
              + {f.itemLabel}
            </button>
          )}
        </div>
      );
    }
  }
}

export default function ContentPage() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState(SECTIONS[0].id);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    adminFetch<{ data: unknown }>('/api/admin/content')
      .then((d) => setData(mergeContent(DEFAULT_CONTENT, d.data)))
      .catch((e) => setMsg({ kind: 'error', text: e.message }));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save() {
    if (!data) return;
    setBusy(true);
    setMsg(null);
    try {
      await adminFetch('/api/admin/content', { method: 'PUT', body: JSON.stringify({ data }) });
      await refreshSite();
      setDirty(false);
      setMsg({ kind: 'ok', text: 'जतन केले. वेबसाइटवर बदल दिसतील. · Saved. The website now shows your changes.' });
    } catch (e) {
      setMsg({ kind: 'error', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  function resetSection() {
    if (!data || !confirm('हा भाग मूळ मजकुरावर परत आणायचा? · Reset this section to the original text?')) return;
    const keys = new Set(SECTIONS.find((s) => s.id === tab)!.fields.map((f) => f.path.split('.')[0]));
    let next = data;
    keys.forEach((k) => (next = set(next, k, structuredClone(DEFAULT_CONTENT[k as keyof SiteContent]))));
    setData(next);
    setDirty(true);
  }

  const section = SECTIONS.find((s) => s.id === tab)!;

  return (
    <>
      <PageTitle mr="वेबसाइट मजकूर" en="Website content: text, photos, contact details and franchise plans">
        <button type="button" onClick={save} disabled={!dirty || busy} className="btn-primary disabled:opacity-50">
          {busy ? '…' : dirty ? 'जतन करा · Save changes' : 'जतन केले · Saved'}
        </button>
      </PageTitle>
      {msg && (
        <div className="mb-5">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}
      {!data ? (
        <p className="text-stone">Loading…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Sections">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTab(s.id)}
                aria-current={tab === s.id ? 'true' : undefined}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-[.9rem] transition ${tab === s.id ? 'bg-wood text-ivory' : 'bg-white/60 hover:bg-white'}`}
              >
                {s.mr}
                <span className="block text-[.72rem] opacity-70">{s.en}</span>
              </button>
            ))}
          </nav>
          <Panel
            title={`${section.mr} · ${section.en}`}
            actions={
              <button type="button" onClick={resetSection} className="text-[.82rem] text-stone underline-offset-2 hover:underline">
                मूळ मजकूर · Reset to original
              </button>
            }
          >
            {section.fields.map((f) => (
              <FieldEditor
                key={f.path}
                f={f}
                value={get(data, f.path)}
                onChange={(v) => {
                  setData((d) => set(d!, f.path, v));
                  setDirty(true);
                }}
              />
            ))}
          </Panel>
        </div>
      )}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-ivory/95 p-3 backdrop-blur lg:left-[260px]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-2">
            <span className="text-[.9rem] text-charcoal">न जतन केलेले बदल · Unsaved changes</span>
            <button type="button" onClick={save} disabled={busy} className="btn-primary px-5 py-2 disabled:opacity-60">{busy ? '…' : 'जतन करा · Save'}</button>
          </div>
        </div>
      )}
    </>
  );
}
