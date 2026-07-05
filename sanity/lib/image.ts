import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { dataset, projectId } from '../env';

const builder = imageUrlBuilder({ projectId, dataset });

// Build a Sanity image URL. Feed the result to next/image.
export function urlForImage(source: Image) {
  return builder.image(source);
}
