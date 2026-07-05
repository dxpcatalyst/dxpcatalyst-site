import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use the CDN in production for fast, cached reads. ISR handles freshness.
  useCdn: true,
  perspective: 'published',
});
