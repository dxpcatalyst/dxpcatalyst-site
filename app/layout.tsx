import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { HubSpotTracking } from '@/components/HubSpotTracking';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Ai12zWidget } from '@/components/Ai12zWidget';
import { gilroy } from '@/lib/fonts';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import './globals.css';

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
    <html lang="en" className={gilroy.variable}>
      <body className="font-sans">
        {children}
        {/* Global third-party scripts (spec §1a, §3) — non-blocking. */}
        <HubSpotTracking />
        <Ai12zWidget />
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
