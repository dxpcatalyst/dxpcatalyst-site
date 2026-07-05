import localFont from 'next/font/local';

// Gilroy — the brand typeface (design tokens §2). Five self-hosted weights,
// applied globally in app/layout.tsx via the --font-gilroy CSS variable that
// Tailwind's font-sans reads. The .ttf files live in public/fonts/ (a commercial
// font — see public/fonts/README.md).
export const gilroy = localFont({
  src: [
    { path: '../public/fonts/Gilroy-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/Gilroy-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Gilroy-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Gilroy-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/Gilroy-Heavy.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});
