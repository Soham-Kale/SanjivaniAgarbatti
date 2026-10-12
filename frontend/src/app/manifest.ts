import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'संजीवनी अगरबत्ती · Sanjivani Agarbatti',
    short_name: 'Sanjivani',
    description: 'Agarbatti, dhoop, cup dhoop and puja sahitya from Malewadi-Akluj, Maharashtra.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8EF',
    theme_color: '#120A21',
    lang: 'mr',
    icons: [{ src: '/images/brand/logo-180.png', sizes: '180x180', type: 'image/png' }],
  };
}
