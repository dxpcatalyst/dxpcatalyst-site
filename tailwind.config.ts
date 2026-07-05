import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette placeholders — swap for final DXP Catalyst brand values.
        brand: {
          DEFAULT: '#1a3d8f',
          dark: '#0f2657',
          accent: '#2f6df6',
        },
      },
    },
  },
  plugins: [],
};

export default config;
