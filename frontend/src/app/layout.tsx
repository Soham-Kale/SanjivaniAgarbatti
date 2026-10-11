import type { Metadata, Viewport } from 'next';
import { Eczar, Mukta } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatButtons from '@/components/FloatButtons';

const eczar = Eczar({ subsets: ['devanagari', 'latin'], weight: ['500', '600', '700'], variable: '--font-eczar', display: 'swap' });
const mukta = Mukta({ subsets: ['devanagari', 'latin'], weight: ['300', '400', '500', '600'], variable: '--font-mukta', display: 'swap' });

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

export const viewport: Viewport = { themeColor: '#0e0b09' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" className={`${eczar.variable} ${mukta.variable}`}>
      <body>
        <LangProvider>
          <Header />
          <main id="top">{children}</main>
          <Footer />
          <FloatButtons />
        </LangProvider>
      </body>
    </html>
  );
}
