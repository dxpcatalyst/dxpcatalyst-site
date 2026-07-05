import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio', // Sanity Studio is no-index (spec §6).
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  };
}
