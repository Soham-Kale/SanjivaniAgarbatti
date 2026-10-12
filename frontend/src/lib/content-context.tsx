'use client';

import { createContext, useCallback, useContext } from 'react';
import { DEFAULT_CONTENT, type SiteContent } from './content';

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);

/** WhatsApp click-to-chat link for the number set in the admin panel. */
export function useWa() {
  const { site } = useContent();
  return useCallback(
    (text?: string) => `https://wa.me/${site.whatsapp.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
    [site.whatsapp]
  );
}
