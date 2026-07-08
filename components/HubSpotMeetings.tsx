'use client';

import { useEffect, useState } from 'react';

// HubSpot meetings scheduler embed (spec §1c). Renders the full scheduler;
// if the embed fails, falls back to a plain-text link to the meeting URL.
const EMBED_SRC =
  'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';

export function HubSpotMeetings({ meetingUrl }: { meetingUrl?: string }) {
  const [failed, setFailed] = useState(false);

  // Append a fresh copy of the embed script on every mount. The script scans
  // the DOM for `.meetings-iframe-container` when it executes and injects the
  // scheduler iframe. Loading it via next/script deduped the load across
  // client-side navigations, so the scan never re-ran and the iframe was
  // missing until a hard refresh. Running this effect after the container has
  // mounted guarantees the scan finds it, on both hard loads and soft nav.
  useEffect(() => {
    if (!meetingUrl) return;
    setFailed(false);
    const script = document.createElement('script');
    script.src = EMBED_SRC;
    script.async = true;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [meetingUrl]);

  if (!meetingUrl) {
    return (
      <p className="text-sm text-gray-700">
        The scheduler is not configured yet. Please check back shortly.
      </p>
    );
  }

  return (
    <div>
      {!failed && (
        <div
          className="meetings-iframe-container min-h-[640px]"
          data-src={`${meetingUrl}?embed=true`}
        />
      )}

      {failed && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-700">
            The scheduler could not be loaded.{' '}
            <a
              href={meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Open the booking page directly
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
