'use client';

import { useEffect } from 'react';

// ai12z conversational assistant — floating chat, bottom-right, on every page.
// Loads the ai12z web-components library (ES module + stylesheet) and renders
// the <ai12z-bot> custom element. data-key is a public embed key (it is exposed
// client-side in the page HTML on every ai12z site), so it is safe to ship in
// the bundle; NEXT_PUBLIC_AI12Z_API_KEY overrides it if set.
const AI12Z_JS = 'https://cdn.ai12z.net/pkg/ai12z@latest/dist/esm/library.js';
const AI12Z_CSS = 'https://cdn.ai12z.net/pkg/ai12z@latest/dist/library/library.css';
const AI12Z_KEY =
  process.env.NEXT_PUBLIC_AI12Z_API_KEY ||
  '7f49c3737a07726b3bc910ca3f32fc26cbe4d02b34de6fadecef411355fcd439';

export function Ai12zWidget() {
  useEffect(() => {
    if (!AI12Z_KEY) return;
    if (!document.querySelector('link[data-ai12z]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = AI12Z_CSS;
      link.setAttribute('data-ai12z', '');
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-ai12z]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = AI12Z_JS;
      script.setAttribute('data-ai12z', '');
      document.body.appendChild(script);
    }
  }, []);

  if (!AI12Z_KEY) return null;
  return (
    // @ts-expect-error — ai12z custom element is not in the JSX intrinsic types
    <ai12z-bot data-key={AI12Z_KEY} />
  );
}
