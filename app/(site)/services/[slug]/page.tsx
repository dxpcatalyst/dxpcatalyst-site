import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { servicePageBySlugQuery, servicePageSlugsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';
import { Testimonials, type Testimonial } from '@/components/Testimonials';

type ServicePage = {
  title?: string;
  slug?: string;
  heroText?: any;
  sections?: { heading?: string; body?: any }[];
  representativeWork?: { label?: string; description?: string; url?: string }[];
  testimonials?: Testimonial[];
  ctaLabel?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

// Filter service-page testimonials to the offering's tag (dxp / crm) per spec §9.
function tagForSlug(slug?: string): 'dxp' | 'crm' | null {
  if (slug === 'dxp-advisory') return 'dxp';
  if (slug === 'hubspot-salesforce') return 'crm';
  return null;
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: servicePageSlugsQuery,
    tags: ['servicePage'],
  });
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await sanityFetch<ServicePage>({
    query: servicePageBySlugQuery,
    params: { slug: params.slug },
    tags: ['servicePage'],
  });
  if (!page) return {};
  return buildMetadata({
    seo: page.seo,
    pageTitle: page.title || 'Services',
    path: `/services/${params.slug}`,
  });
}

export default async function ServicePageRoute({ params }: { params: { slug: string } }) {
  const page = await sanityFetch<ServicePage>({
    query: servicePageBySlugQuery,
    params: { slug: params.slug },
    tags: ['servicePage'],
  });
  if (!page) notFound();

  const tag = tagForSlug(params.slug);
  const testimonials = tag
    ? (page.testimonials || []).filter((t) => t.tag === tag)
    : page.testimonials;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="container-page py-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{page.title}</h1>
          {page.heroText && (
            <div className="mt-4 max-w-3xl text-lg">
              <PortableText value={page.heroText} />
            </div>
          )}
        </div>
      </section>

      {/* Content sections — the uniform body shared by every service page. */}
      {page.sections && page.sections.length > 0 && (
        <section className="container-page py-16">
          <div className="max-w-3xl space-y-12">
            {page.sections.map((s, i) => (
              <div key={i}>
                {s.heading && (
                  <h2 className="text-2xl font-semibold text-gray-900">{s.heading}</h2>
                )}
                {s.body && (
                  <div className="mt-4">
                    <PortableText value={s.body} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Representative work */}
      {page.representativeWork && page.representativeWork.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Representative work</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {page.representativeWork.map((w, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">{w.label}</h3>
                <p className="mt-2 text-sm text-gray-600">{w.description}</p>
                {w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-brand hover:underline"
                  >
                    Read more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials (tag-filtered) */}
      <Testimonials items={testimonials} />

      {/* CTA */}
      <section className="container-page py-16 text-center">
        <Link href="/book" className="btn-primary">
          {page.ctaLabel || 'Book a Consultation'}
        </Link>
      </section>
    </>
  );
}
