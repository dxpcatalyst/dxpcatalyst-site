import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import {
  servicePageSlugsQuery,
  insightPostSlugsQuery,
  caseStudySlugsQuery,
} from '@/sanity/lib/queries';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, cases] = await Promise.all([
    sanityFetch<{ slug: string }[]>({ query: servicePageSlugsQuery, tags: ['servicePage'] }),
    sanityFetch<{ slug: string }[]>({ query: insightPostSlugsQuery, tags: ['insightPost'] }),
    sanityFetch<{ slug: string }[]>({ query: caseStudySlugsQuery, tags: ['caseStudy'] }),
  ]);

  const staticRoutes = ['/', '/about', '/insights', '/work', '/contact', '/book', '/privacy'];

  const urls: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  for (const s of services || []) {
    urls.push({ url: new URL(`/services/${s.slug}`, SITE_URL).toString(), priority: 0.8 });
  }
  for (const p of posts || []) {
    urls.push({ url: new URL(`/insights/${p.slug}`, SITE_URL).toString(), priority: 0.6 });
  }
  for (const c of cases || []) {
    urls.push({ url: new URL(`/work/${c.slug}`, SITE_URL).toString(), priority: 0.6 });
  }

  return urls;
}
