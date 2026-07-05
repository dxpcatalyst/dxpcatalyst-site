import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { HubSpotTracking } from '@/components/HubSpotTracking';
import { Ai12zWidget } from '@/components/Ai12zWidget';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import './globals.css';

// next/font — no layout shift, self-hosted (spec §7).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Platform advisory, selection, and post-selection architecture for modern digital ecosystems.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        {/* Global third-party scripts (spec §1a, §3) — non-blocking. */}
        <HubSpotTracking />
        <Ai12zWidget />
        <Analytics />
      </body>
    </html>
  );
}
