import Script from 'next/script';

// Global HubSpot tracking (spec §1a). Loaded on every page via the root layout.
// Portal ID from NEXT_PUBLIC_HUBSPOT_PORTAL_ID. Non-blocking (afterInteractive).
export function HubSpotTracking() {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  if (!portalId) return null;
  return (
    <Script
      id="hs-script-loader"
      strategy="afterInteractive"
      src={`//js.hs-scripts.com/${portalId}.js`}
    />
  );
}
