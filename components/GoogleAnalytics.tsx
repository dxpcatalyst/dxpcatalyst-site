import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

// Google Analytics 4. Loaded on every page via the root layout, keyed off
// NEXT_PUBLIC_GA_MEASUREMENT_ID (a public Measurement ID, e.g. "G-XXXXXXXXXX").
// Returns null when unset, so it is a safe no-op until the ID is configured in
// Vercel (Production env var) and .env.local (dev). Uses @next/third-parties,
// which fires a page_view on App Router client-side route changes.
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;
  return <NextGoogleAnalytics gaId={gaId} />;
}
