import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Devanagari, Tiro_Devanagari_Marathi } from 'next/font/google';
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

// Tiro Devanagari Marathi is drawn specifically for Marathi (correct ळ, ऱ्, conjuncts) and
// pairs a calm serif with Latin. Noto Sans Devanagari is the most complete, readable body face.
// Both are self-hosted by next/font at build time: no runtime request to Google.
const display = Tiro_Devanagari_Marathi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});
const body = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: seo.title, template: '%s | संजीवनी अगरबत्ती' },
    description: seo.description,
    keywords: ['संजीवनी अगरबत्ती', 'Sanjivani Agarbatti', 'धूप', 'अगरबत्ती अकलूज', 'agarbatti franchise Maharashtra', 'puja sahitya'],
    icons: { icon: '/images/brand/logo-180.png', apple: '/images/brand/logo-180.png' },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: ['/images/brand/logo.png'],
      locale: 'mr_IN',
      type: 'website',
    },
  };
}

export const viewport: Viewport = { themeColor: '#120A21' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { site } = content;
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name.en,
    alternateName: site.name.mr,
    telephone: site.phones.map((p) => p.tel),
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: site.address.en, addressLocality: 'Akluj', addressRegion: 'Maharashtra', postalCode: '413101', addressCountry: 'IN' },
  };
  return (
    <html lang="mr" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
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
