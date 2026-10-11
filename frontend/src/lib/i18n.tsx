'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { I18n, Lang } from './types';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (s: I18n) => string };
const LangContext = createContext<Ctx | null>(null);
const KEY = 'sanjivani-lang';

/** Marathi-first. English is an optional toggle remembered per browser. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('mr');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'en' || saved === 'mr') setLangState(saved);
    } catch {
      /* storage blocked: stay on Marathi */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((s: I18n) => (lang === 'en' && s.en ? s.en : s.mr), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
