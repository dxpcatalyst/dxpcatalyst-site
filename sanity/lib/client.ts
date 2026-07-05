import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use the CDN in production for fast, cached reads (ISR handles freshness).
  // In development hit the live API so content edits show up on refresh.
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});
