import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';

// next-sanity provides metadata (incl. robots noindex) + viewport for the Studio.
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
