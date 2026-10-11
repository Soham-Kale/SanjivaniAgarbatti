import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Devanagari, Tiro_Devanagari_Marathi } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatButtons from '@/components/FloatButtons';
import CartDrawer from '@/components/cart/CartDrawer';
import { SITE } from '@/lib/site';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'संजीवनी धूप आणि अगरबत्ती | Sanjivani Agarbatti, Akluj', template: '%s | संजीवनी अगरबत्ती' },
  description:
    'प्रार्थनेचा पवित्र सुगंध. प्रीमियम अगरबत्ती, धूप कांडी, कप धूप व पूजा साहित्य, माळेवाडी-अकलूज. घाऊक, किरकोळ व फ्रँचायझी संपूर्ण महाराष्ट्रात.',
  keywords: ['संजीवनी अगरबत्ती', 'Sanjivani Agarbatti', 'धूप', 'अगरबत्ती अकलूज', 'agarbatti franchise Maharashtra', 'puja sahitya'],
  icons: { icon: '/images/brand/logo-180.png', apple: '/images/brand/logo-180.png' },
  openGraph: {
    title: 'संजीवनी धूप आणि अगरबत्ती',
    description: 'Bringing Divine Fragrance to Every Home',
    images: ['/images/brand/logo.png'],
    locale: 'mr_IN',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#163D32' };

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE.name.en,
  alternateName: SITE.name.mr,
  telephone: SITE.phones.map((p) => p.tel),
  email: SITE.email,
  address: { '@type': 'PostalAddress', streetAddress: SITE.address.en, addressLocality: 'Akluj', addressRegion: 'Maharashtra', postalCode: '413101', addressCountry: 'IN' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory">
          मुख्य मजकुराकडे जा
        </a>
        <LangProvider>
          <CartProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <FloatButtons />
            <CartDrawer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
