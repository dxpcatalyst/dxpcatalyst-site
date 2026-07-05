import type { QueryParams } from 'next-sanity';
import { client } from './client';

// Default ISR revalidation window (1 hour), matching the Beehiiv feed cadence.
export const DEFAULT_REVALIDATE = 3600;

// Thin wrapper around client.fetch that applies ISR + cache tags so the
// /api/revalidate webhook can purge on Sanity publish.
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = DEFAULT_REVALIDATE,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T | null> {
  try {
    // In development, always fetch fresh so content edits appear on refresh
    // (no need to clear .next). In production, use tag-based ISR: pages hold
    // their cache until the Sanity publish webhook purges the tag.
    const fetchOptions =
      process.env.NODE_ENV === 'development'
        ? ({ cache: 'no-store' } as const)
        : {
            next: {
              revalidate: tags.length ? false : revalidate,
              tags,
            },
          };
    return await client.fetch<T>(query, params, fetchOptions);
  } catch (err) {
    // Stay resilient: a Sanity outage (or an unconfigured project during an
    // early build) should degrade to empty content, not crash the whole page.
    console.error('[sanityFetch] query failed:', err);
    return null;
  }
}
