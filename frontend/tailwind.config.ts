import type { Config } from 'tailwindcss';

/**
 * Sanjivani "sandhya aarti" palette: royal plum night for dark bands, headings and buttons,
 * saffron and temple gold for light and glow, kumkum pink-red for small highlights, and a warm
 * cream for reading sections. Token names are kept from the first design (wood, sand, ...), so
 * every component, including the admin panel, picks up the new colours.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#FFF8EF', 2: '#FBF0E3', 3: '#F3E1CC' },
        wood: { DEFAULT: '#2B1745', deep: '#1C0F30', night: '#120A21', light: '#45286B' },
        maroon: { DEFAULT: '#C2185B', light: '#E84A7F' },
        sandal: { DEFAULT: '#9A5B3F', light: '#C98B68' },
        gold: { DEFAULT: '#F2B33D', light: '#FFD480', deep: '#94600C' },
        sand: { DEFAULT: '#F7E8DA', deep: '#EFD6C0' },
        charcoal: { DEFAULT: '#1E1730', soft: '#3A3150' },
        stone: '#675C78',
        mist: '#CDBFE0',
        saffron: '#FF7A1A',
        ember: '#FF4D2E',
        lotus: '#F59BC0',
      },
      fontFamily: {
        // One family everywhere. Noto Sans Devanagari / Mukta only apply if Poppins fails to load.
        display: ['Poppins', 'Noto Sans Devanagari', 'Mukta', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'Noto Sans Devanagari', 'Mukta', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1280px' },
      borderColor: { DEFAULT: 'rgba(30,23,48,.12)' },
      boxShadow: {
        card: '0 1px 0 rgba(30,23,48,.04), 0 18px 40px -24px rgba(43,23,69,.38)',
        lift: '0 2px 0 rgba(30,23,48,.04), 0 34px 70px -30px rgba(43,23,69,.55)',
        glow: '0 0 120px -20px rgba(255,122,26,.55)',
        'glow-sm': '0 10px 40px -12px rgba(255,122,26,.65)',
        'glow-pink': '0 10px 50px -14px rgba(194,24,91,.6)',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,1,.36,1)' },
      keyframes: {
        aurora: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-4%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-5%,5%,0) scale(.96)' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        shine: { from: { transform: 'translateX(-120%) skewX(-20deg)' }, to: { transform: 'translateX(220%) skewX(-20deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        wheel: { '0%': { transform: 'translateY(0)', opacity: '1' }, '80%,100%': { transform: 'translateY(12px)', opacity: '0' } },
        'border-spin': { to: { '--angle': '360deg' } },
        curtain: { '0%,20%': { transform: 'scaleY(1)' }, '100%': { transform: 'scaleY(0)' } },
        'curtain-mark': { '0%': { opacity: '0', transform: 'scale(.8)' }, '30%': { opacity: '1', transform: 'scale(1)' }, '60%,100%': { opacity: '0', transform: 'scale(1.05)' } },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        'aurora-slow': 'aurora 26s ease-in-out infinite reverse',
        'spin-slow': 'spin-slow 40s linear infinite',
        'spin-slower': 'spin-slow 70s linear infinite reverse',
        float: 'float 7s ease-in-out infinite',
        wheel: 'wheel 1.8s ease-out infinite',
        'border-spin': 'border-spin 6s linear infinite',
        curtain: 'curtain .9s cubic-bezier(.76,0,.24,1) forwards',
        'curtain-mark': 'curtain-mark .9s ease forwards',
      },
    },
  },
  plugins: [],
};
export default config;
