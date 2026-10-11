import type { Config } from 'tailwindcss';

// Palette from the "Divya" dark premium design option.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0e0b09', 2: '#17120e', 3: '#221a14', deep: '#080605' },
        gold: { DEFAULT: '#d4ab5a', soft: '#8c7038', light: '#e7c26f', dark: '#b48a3a' },
        ember: '#ff7b30',
        ivory: '#f1e8d8',
        muted: '#a99a88',
        sand: '#d4c7b3',
        line: 'rgba(212,171,90,.22)',
      },
      fontFamily: {
        display: ['var(--font-eczar)', 'Tiro Devanagari Marathi', 'Georgia', 'serif'],
        body: ['var(--font-mukta)', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1180px' },
      boxShadow: {
        lift: '0 30px 60px -20px rgba(0,0,0,.8), 0 0 0 1px #8c7038',
        ember: '0 0 80px -10px rgba(255,123,48,.35)',
      },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg,#e7c26f,#b48a3a)',
        'hero-glow': 'radial-gradient(ellipse at 70% 60%,#2b1d12 0%,#0e0b09 62%)',
      },
    },
  },
  plugins: [],
};
export default config;
