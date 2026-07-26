import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

// Google Analytics 4. Loaded on every page via the root layout. The production
// Measurement ID (a public value, exposed client-side on every GA site) is the
// default; NEXT_PUBLIC_GA_MEASUREMENT_ID overrides it when set (e.g. a separate
// property for previews). Uses @next/third-parties, which fires a page_view on
// App Router client-side route changes.
const DEFAULT_GA_ID = 'G-SK6C6WF2TS';

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
  if (!gaId) return null;
  return <NextGoogleAnalytics gaId={gaId} />;
}
