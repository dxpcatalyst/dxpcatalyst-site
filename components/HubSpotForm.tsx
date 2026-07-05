'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type Props = {
  portalId?: string;
  formId?: string;
  email?: string;
  phone?: string;
};

// HubSpot contact form embed (spec §1b). Renders the form via the HubSpot embed
// script; if the script/form fails to load, falls back to plain-text contact info.
export function HubSpotForm({ portalId, formId, email, phone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const resolvedPortalId = portalId || process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const resolvedFormId = formId || process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID;

  useEffect(() => {
    if (!ready || !resolvedPortalId || !resolvedFormId) return;
    const hbspt = (window as any).hbspt;
    if (!hbspt?.forms) {
      setFailed(true);
      return;
    }
    hbspt.forms.create({
      portalId: resolvedPortalId,
      formId: resolvedFormId,
      target: '#hubspot-form-target',
    });
  }, [ready, resolvedPortalId, resolvedFormId]);

  // If config is missing, go straight to fallback.
  const missingConfig = !resolvedPortalId || !resolvedFormId;

  return (
    <div>
      {!missingConfig && (
        <Script
          src="//js.hsforms.net/forms/embed/v2.js"
          strategy="afterInteractive"
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      {!missingConfig && !failed && <div id="hubspot-form-target" ref={containerRef} />}

      {(failed || missingConfig) && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-700">
            The form could not be loaded. Please reach us directly:
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="text-brand hover:underline">
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone}`} className="text-brand hover:underline">
                  {phone}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
