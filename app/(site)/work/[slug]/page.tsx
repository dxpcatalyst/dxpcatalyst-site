import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { caseStudyBySlugQuery, caseStudySlugsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';

type CaseStudy = {
  title?: string;
  slug?: string;
  clientName?: string;
  clientType?: string;
  industry?: string;
  facts?: { label?: string; value?: string }[];
  challenge?: any;
  whatWeDid?: any;
  outcome?: any;
  isAnonymized?: boolean;
  relatedOfferingTitle?: string;
  relatedOfferingSlug?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: caseStudySlugsQuery,
    tags: ['caseStudy'],
  });
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cs = await sanityFetch<CaseStudy>({
    query: caseStudyBySlugQuery,
    params: { slug: params.slug },
    tags: ['caseStudy'],
  });
  if (!cs) return {};
  return buildMetadata({ seo: cs.seo, pageTitle: cs.title || 'Case study', path: `/work/${params.slug}` });
}

export default async function CaseStudyRoute({ params }: { params: { slug: string } }) {
  const cs = await sanityFetch<CaseStudy>({
    query: caseStudyBySlugQuery,
    params: { slug: params.slug },
    tags: ['caseStudy'],
  });
  if (!cs) notFound();

  const client = cs.isAnonymized ? cs.clientType || 'Confidential client' : cs.clientName || cs.title;

  return (
    <article className="container-page py-16">
      <div className="mx-auto max-w-narrow">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Case study</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">{cs.title}</h1>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          <div>
            <dt className="font-medium text-gray-900">Client</dt>
            <dd>{client}</dd>
          </div>
          {cs.industry && (
            <div>
              <dt className="font-medium text-gray-900">Industry</dt>
              <dd>{cs.industry}</dd>
            </div>
          )}
          {(cs.facts || [])
            .filter((f) => f.label && f.value)
            .map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-gray-900">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
        </dl>

        {cs.challenge && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">The challenge</h2>
            <div className="mt-3">
              <PortableText value={cs.challenge} />
            </div>
          </section>
        )}

        {cs.whatWeDid && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">What we did</h2>
            <div className="mt-3">
              <PortableText value={cs.whatWeDid} />
            </div>
          </section>
        )}

        {cs.outcome && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Outcome</h2>
            <div className="mt-3">
              <PortableText value={cs.outcome} />
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-8">
          {cs.relatedOfferingSlug && (
            <Link
              href={`/services/${cs.relatedOfferingSlug}`}
              className="text-sm font-medium text-brand hover:underline"
            >
              Related offering: {cs.relatedOfferingTitle} →
            </Link>
          )}
          <Link href="/book" className="btn-primary ml-auto">
            Book a Consultation
          </Link>
        </div>
      </div>
    </article>
  );
}
