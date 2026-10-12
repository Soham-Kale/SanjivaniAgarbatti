import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LangProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatButtons from '@/components/FloatButtons';
import CartDrawer from '@/components/cart/CartDrawer';
import { Announcement, SiteOnly } from '@/components/SiteChrome';
import { CursorRing, ScrollProgress } from '@/components/fx/Effects';
import { ContentProvider } from '@/lib/content-context';
import { getContent } from '@/lib/api';
import { KEYWORDS, SITE_URL, ldJson, pageMeta, siteJsonLd } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: 'Sanjivani Agarbatti',
    keywords: KEYWORDS,
    authors: [{ name: 'Sanjivani Incense Sticks & Agarbatti', url: SITE_URL }],
    creator: 'Sanjivani Incense Sticks & Agarbatti',
    publisher: 'Sanjivani Incense Sticks & Agarbatti',
    category: 'shopping',
    formatDetection: { telephone: true, address: false, email: false },
    icons: { icon: '/images/brand/logo-180.png', apple: '/images/brand/logo-180.png' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    // Search Console / Bing Webmaster ownership codes (HTML-tag method), set on Vercel.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
    },
    // Share preview defaults. Canonical links are set per page (a site-wide one would point
    // every page at the home page).
    ...withoutCanonical(pageMeta({ title: seo.title, description: seo.description, path: '/' })),
    title: { default: seo.title, template: '%s | संजीवनी अगरबत्ती · Sanjivani Agarbatti' },
  };
}

const withoutCanonical = ({ alternates: _drop, ...rest }: Metadata) => rest;

export const viewport: Viewport = { themeColor: '#120A21' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="mr">
      <head>
        {/* Poppins is self-hosted (public/fonts, see globals.css). Preload the faces every page uses first. */}
        {['400-devanagari', '600-devanagari', '400-latin', '600-latin'].map((f) => (
          <link key={f} rel="preload" href={`/fonts/poppins-${f}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(siteJsonLd(content))} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-wood focus:px-4 focus:py-2 focus:text-ivory">
          मुख्य मजकुराकडे जा
        </a>
        <LangProvider>
          <ContentProvider value={content}>
            <CartProvider>
              <SiteOnly>
                <ScrollProgress />
                <CursorRing />
                <Announcement />
                <Header />
              </SiteOnly>
              <main id="main">{children}</main>
              <SiteOnly>
                <Footer />
                <FloatButtons />
                <CartDrawer />
              </SiteOnly>
            </CartProvider>
          </ContentProvider>
        </LangProvider>
      </body>
    </html>
  );
}
