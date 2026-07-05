import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/fetch';
import { workPageQuery, caseStudiesQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';

type WorkPage = {
  headline?: string;
  introText?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

type CaseStudyCard = {
  _id: string;
  title?: string;
  slug?: string;
  clientName?: string;
  clientType?: string;
  industry?: string;
  isAnonymized?: boolean;
  relatedOfferingTitle?: string;
  relatedOfferingSlug?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<WorkPage>({ query: workPageQuery, tags: ['workPage'] });
  return buildMetadata({ seo: page?.seo, pageTitle: page?.headline || 'Work', path: '/work' });
}

function offeringTag(slug?: string): string | null {
  if (slug === 'dxp-advisory') return 'DXP Advisory';
  if (slug === 'hubspot-salesforce') return 'HubSpot & Salesforce';
  return null;
}

export default async function WorkPageRoute() {
  const [page, studies] = await Promise.all([
    sanityFetch<WorkPage>({ query: workPageQuery, tags: ['workPage'] }),
    sanityFetch<CaseStudyCard[]>({ query: caseStudiesQuery, tags: ['caseStudy'] }),
  ]);

  return (
    <section className="container-page py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {page?.headline || 'Our work'}
      </h1>
      {page?.introText && <p className="mt-4 max-w-2xl text-lg text-gray-600">{page.introText}</p>}

      {studies && studies.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((cs) => {
            const client = cs.isAnonymized ? cs.clientType || 'Confidential client' : cs.clientName || cs.title;
            const tag = offeringTag(cs.relatedOfferingSlug);
            return (
              <Link
                key={cs._id}
                href={`/work/${cs.slug}`}
                className="group rounded-lg border-l-4 border-brand bg-gray-light p-6 transition hover:shadow-sm"
              >
                {tag && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">{tag}</span>
                )}
                <h2 className="mt-1 text-lg font-semibold text-brand-charcoal group-hover:text-brand">
                  {client}
                </h2>
                {cs.industry && <p className="mt-1 text-sm text-gray-mid">{cs.industry}</p>}
                <span className="mt-3 inline-block text-sm font-medium text-brand">View case study →</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-gray-600">Case studies are coming soon.</p>
      )}
    </section>
  );
}
