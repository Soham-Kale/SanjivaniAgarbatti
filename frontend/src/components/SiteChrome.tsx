'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { useContent } from '@/lib/content-context';

/** Renders the public site's header/footer parts everywhere except the admin panel. */
export function SiteOnly({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path?.startsWith('/admin') ? null : <>{children}</>;
}

/** Optional one-line notice above the header, switched on from the admin panel. */
export function Announcement() {
  const { t } = useLang();
  const { announcement } = useContent();
  const text = t(announcement.text);
  if (!announcement.enabled || !text) return null;
  const inner = <span className="mx-auto block max-w-wrap px-4 py-2 text-center text-[.88rem] font-semibold">{text}</span>;
  return (
    <div className="relative z-[60] bg-gradient-to-r from-maroon via-ember to-saffron text-white">
      {announcement.link ? (
        <Link href={announcement.link} className="block hover:underline">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
