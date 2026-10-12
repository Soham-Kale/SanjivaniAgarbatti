import type { Metadata } from 'next';
import type { SiteContent } from './content';
import type { Product } from './types';

/**
 * The public address of the site, used for canonical links, the sitemap, share previews and
 * structured data. Set NEXT_PUBLIC_SITE_URL to the real domain (e.g. https://sanjivaniagarbatti.in).
 * On Vercel without it, the project's production address is used.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

export const BRAND = { mr: 'संजीवनी अगरबत्ती', en: 'Sanjivani Agarbatti' };
export const DEFAULT_OG = '/images/og.jpg';

export const KEYWORDS = [
  'Sanjivani Agarbatti',
  'sanjivaniagarbatti',
  'संजीवनी अगरबत्ती',
  'संजीवनी धूप',
  'Sanjivani Dhoop',
  'Sanjivani Agarbatti Akluj',
  'agarbatti Akluj',
  'agarbatti manufacturer Solapur',
  'dhoop sticks Maharashtra',
  'cup dhoop',
  'puja sahitya Akluj',
  'अगरबत्ती अकलूज',
  'धूप कांडी',
  'पूजा साहित्य',
  'agarbatti franchise Maharashtra',
  'agarbatti wholesale',
];

/** Title, description, canonical link and share preview for one page. */
export function pageMeta({ title, description, path, image }: { title?: string; description: string; path: string; image?: string }): Metadata {
  const images = [{ url: abs(image || DEFAULT_OG), alt: title || BRAND.en }];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: abs(path) },
    openGraph: {
      type: 'website',
      url: abs(path),
      siteName: `${BRAND.mr} · ${BRAND.en}`,
      locale: 'mr_IN',
      alternateLocale: ['en_IN'],
      ...(title ? { title } : {}),
      description,
      images,
    },
    twitter: { card: 'summary_large_image', ...(title ? { title } : {}), description, images: images.map((i) => i.url) },
  };
}

/** "FOUNDER & M.D." -> "Founder & Managing Director" */
export const roleTitle = (role: string) =>
  role
    .toLowerCase()
    .replace(/\bm\.d\.?/g, 'managing director')
    .replace(/\bceo\b/g, 'CEO')
    .replace(/(^|\s)([a-z])/g, (_, s: string, c: string) => s + c.toUpperCase())
    .replace(/\bAnd\b/g, 'and');

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const personId = (i: number) => `${SITE_URL}/about#founder-${i + 1}`;

/**
 * Site-wide structured data: the business (with its founders), and the website. This is what
 * Google's knowledge panel and AI answer engines read to know who Sanjivani is.
 */
export function siteJsonLd(c: SiteContent) {
  const { site } = c;
  const founders = site.phones.map((p, i) => ({
    '@type': 'Person',
    '@id': personId(i),
    name: p.person.en.replace(/^Mr\.?\s*/i, ''),
    alternateName: p.person.mr.replace(/^श्री\.?\s*/, ''),
    jobTitle: roleTitle(p.role),
    image: abs(p.photo),
    telephone: p.tel,
    worksFor: { '@id': ORG_ID },
    url: `${SITE_URL}/about`,
  }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness', 'Store'],
        '@id': ORG_ID,
        name: site.name.en,
        alternateName: [BRAND.en, BRAND.mr, site.name.mr, 'Sanjivani Dhoop', 'sanjivaniagarbatti'],
        description:
          'Sanjivani Incense Sticks & Agarbatti makes agarbatti, dhoop sticks, cup dhoop and puja sahitya in Malewadi-Akluj (Solapur, Maharashtra), and sells wholesale, retail and through franchise across Maharashtra.',
        slogan: site.motto,
        url: SITE_URL,
        logo: abs('/images/brand/logo.png'),
        image: abs(DEFAULT_OG),
        email: site.email,
        telephone: site.phones[0]?.tel,
        founder: founders.map((f) => ({ '@id': f['@id'] })),
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.en,
          addressLocality: 'Akluj',
          addressRegion: 'Maharashtra',
          postalCode: '413101',
          addressCountry: 'IN',
        },
        hasMap: site.mapUrl,
        areaServed: { '@type': 'State', name: 'Maharashtra' },
        knowsLanguage: ['mr', 'en'],
        contactPoint: site.phones.map((p) => ({
          '@type': 'ContactPoint',
          telephone: p.tel,
          contactType: 'sales',
          areaServed: 'IN',
          availableLanguage: ['Marathi', 'English'],
        })),
        makesOffer: ['Agarbatti (incense sticks)', 'Dhoop sticks', 'Cup dhoop', 'Puja sahitya', 'Agarbatti franchise'].map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Product', name },
        })),
      },
      ...founders,
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: SITE_URL,
        name: `${BRAND.en} · ${BRAND.mr}`,
        alternateName: ['Sanjivani Agarbatti', 'sanjivaniagarbatti'],
        inLanguage: ['mr', 'en'],
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** Product data. Offers are only listed when the admin has set a price; no ratings are invented. */
export function productJsonLd(p: Product) {
  const url = abs(`/products/${p.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: `${p.name.en} (${p.name.mr})`,
    alternateName: p.name.mr,
    url,
    image: [p.image, ...(p.gallery || [])].map(abs),
    description: p.description.en || p.description.mr,
    sku: p.slug,
    category: p.category,
    brand: { '@type': 'Brand', name: BRAND.en },
    manufacturer: { '@id': ORG_ID },
    ...(p.price != null
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: p.price,
            priceCurrency: 'INR',
            availability: p.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            seller: { '@id': ORG_ID },
          },
        }
      : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/** Escapes "<" so a value can never close the <script> tag it is placed in. */
export const ldJson = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
