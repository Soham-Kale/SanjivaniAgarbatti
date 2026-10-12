import type { Config } from 'tailwindcss';

/**
 * Sanjivani design tokens. Ivory and sand backgrounds, deep sandalwood-brown for dark bands,
 * headings and buttons, temple gold as the accent and kumkum maroon (from the catalogue's
 * headings) for small highlights. Charcoal for body text.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#F8F3E9', 2: '#F2EBDC', 3: '#E8DDC6' },
        wood: { DEFAULT: '#3B2416', deep: '#2B190E', night: '#1D1009', light: '#5C3B25' },
        maroon: { DEFAULT: '#8C2A1F', light: '#B4442F' },
        sandal: { DEFAULT: '#79513A', light: '#A3785A' },
        gold: { DEFAULT: '#C99A45', light: '#E2BE78', deep: '#8A6224' },
        sand: { DEFAULT: '#F1E5CF', deep: '#E6D4B4' },
        charcoal: { DEFAULT: '#252722', soft: '#3A3C35' },
        stone: '#5C5A52',
        mist: '#D3C1A8',
        saffron: '#E07A2E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Tiro Devanagari Marathi', 'Noto Serif Devanagari', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Noto Sans Devanagari', 'Mukta', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1240px' },
      borderColor: { DEFAULT: 'rgba(37,39,34,.12)' },
      boxShadow: {
        card: '0 1px 0 rgba(37,39,34,.04), 0 18px 40px -24px rgba(59,36,22,.35)',
        lift: '0 2px 0 rgba(37,39,34,.04), 0 30px 60px -28px rgba(59,36,22,.5)',
        glow: '0 0 120px -20px rgba(201,154,69,.55)',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [],
};
export default config;
