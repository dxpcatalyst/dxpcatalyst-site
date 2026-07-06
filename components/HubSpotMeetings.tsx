'use client';

import Script from 'next/script';
import { useState } from 'react';

// HubSpot meetings scheduler embed (spec §1c). Renders the full scheduler;
// if the embed fails, falls back to a plain-text link to the meeting URL.
export function HubSpotMeetings({ meetingUrl }: { meetingUrl?: string }) {
  const [failed, setFailed] = useState(false);

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
        <>
          <Script
            src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
            strategy="afterInteractive"
            onError={() => setFailed(true)}
          />
          <div
            className="meetings-iframe-container min-h-[640px]"
            data-src={`${meetingUrl}?embed=true`}
          />
        </>
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
