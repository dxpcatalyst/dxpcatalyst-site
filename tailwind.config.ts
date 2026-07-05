import type { Config } from 'tailwindcss';

// Brand tokens from docs/dxpcatalyst-design-tokens.pdf.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Gilroy is applied globally in app/layout.tsx via --font-gilroy.
        sans: ['var(--font-gilroy)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          // DEFAULT keeps existing bg-brand / text-brand / border-brand mapped
          // to Brand Blue.
          DEFAULT: '#285197', // Brand Blue — primary CTA, links, accents, active nav
          blue: '#285197',
          dark: '#21447e', // Brand Blue darkened ~10% for button hover
          charcoal: '#333333', // body text, headings, footer text
          navy: '#1A1F2E', // hero/dark sections, CTA banner, footer bg
          accent: '#285197', // focus rings
          tint: '#EEF3FA', // callouts, testimonial cards, insight hover
          'blue-tint': '#EEF3FA',
        },
        // Named grays from the doc. gray-border (#E5E7EB) and gray-mid (#6B7280)
        // already equal Tailwind's default gray-200 / gray-500; these add
        // semantic aliases without removing the default scale.
        gray: {
          light: '#F8F9FA', // alternate section backgrounds, input fields
          border: '#E5E7EB', // card borders, rules, table lines
          mid: '#6B7280', // secondary text, captions, meta
        },
      },
      maxWidth: {
        content: '1200px', // primary max content width
        narrow: '800px', // body copy, blog posts, case studies
      },
    },
  },
  plugins: [],
};

export default config;
