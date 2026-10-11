import type { Config } from 'tailwindcss';

/**
 * Sanjivani design tokens. Ivory editorial backgrounds, deep forest green for primary bands
 * and buttons (taken from the logo's leaves), saffron gold as a quiet accent, sandalwood for
 * warm detail and charcoal for text.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#F8F3E9', 2: '#F2EBDC', 3: '#E8DDC6' },
        forest: { DEFAULT: '#163D32', deep: '#0E2A22', night: '#091D17', light: '#21503F' },
        sandal: { DEFAULT: '#79513A', light: '#A3785A' },
        gold: { DEFAULT: '#C99A45', light: '#E2BE78', deep: '#8A6224' },
        sage: { DEFAULT: '#DCE5D8', deep: '#C5D3BF' },
        charcoal: { DEFAULT: '#252722', soft: '#3A3C35' },
        stone: '#5C5A52',
        mist: '#B9C7BC',
        saffron: '#E07A2E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Tiro Devanagari Marathi', 'Noto Serif Devanagari', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Noto Sans Devanagari', 'Mukta', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1240px' },
      borderColor: { DEFAULT: 'rgba(37,39,34,.12)' },
      boxShadow: {
        card: '0 1px 0 rgba(37,39,34,.04), 0 18px 40px -24px rgba(22,61,50,.35)',
        lift: '0 2px 0 rgba(37,39,34,.04), 0 30px 60px -28px rgba(22,61,50,.55)',
        glow: '0 0 120px -20px rgba(201,154,69,.55)',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [],
};
export default config;
