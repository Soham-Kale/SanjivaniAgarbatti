'use client';

import { useLang } from '@/lib/i18n';

/** Inline bilingual text for use inside server components: <T mr="…" en="…" /> */
export default function T({ mr, en }: { mr: string; en: string }) {
  const { t } = useLang();
  return <>{t({ mr, en })}</>;
}
