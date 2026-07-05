import Script from 'next/script';

// Global ai12z conversational assistant (spec §3). Floating widget, bottom-right.
// Loaded via the ai12z web component script; API key from env.
// NOTE: confirm the exact script URL / web-component tag with the ai12z connector
// config at integration time — placeholders below match the standard embed shape.
export function Ai12zWidget() {
  const apiKey = process.env.NEXT_PUBLIC_AI12Z_API_KEY;
  if (!apiKey) return null;
  return (
    <>
      <Script
        id="ai12z-widget"
        strategy="lazyOnload"
        src="https://widget.ai12z.net/widget/widget.js"
      />
      {/* @ts-expect-error — ai12z custom element is not in the JSX intrinsic types */}
      <ai12z-widget data-api-key={apiKey} data-position="bottom-right" />
    </>
  );
}
