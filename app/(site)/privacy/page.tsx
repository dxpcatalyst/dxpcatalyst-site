import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { legalPageQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';

type LegalPage = {
  title?: string;
  body?: any;
  lastUpdated?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<LegalPage>({ query: legalPageQuery, tags: ['legalPage'] });
  return buildMetadata({ seo: page?.seo, pageTitle: page?.title || 'Privacy Policy', path: '/privacy' });
}

export default async function PrivacyPageRoute() {
  const page = (await sanityFetch<LegalPage>({ query: legalPageQuery, tags: ['legalPage'] })) || {};

  const updated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="container-page py-16">
      <div className="mx-auto max-w-narrow">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {page.title || 'Privacy Policy'}
        </h1>
        {updated && <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>}
        {page.body && (
          <div className="mt-8">
            <PortableText value={page.body} />
          </div>
        )}
      </div>
    </article>
  );
}
