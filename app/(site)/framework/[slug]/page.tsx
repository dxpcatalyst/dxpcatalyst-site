import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { frameworkPageBySlugQuery, frameworkPageSlugsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';

type FrameworkPage = {
  title?: string;
  slug?: string;
  intro?: any;
  sections?: { heading?: string; body?: any }[];
  ctaLabel?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: frameworkPageSlugsQuery,
    tags: ['frameworkPage'],
  });
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await sanityFetch<FrameworkPage>({
    query: frameworkPageBySlugQuery,
    params: { slug: params.slug },
    tags: ['frameworkPage'],
  });
  if (!page) return {};
  return buildMetadata({
    seo: page.seo,
    pageTitle: page.title || 'Framework',
    path: `/framework/${params.slug}`,
  });
}

export default async function FrameworkPageRoute({ params }: { params: { slug: string } }) {
  const page = await sanityFetch<FrameworkPage>({
    query: frameworkPageBySlugQuery,
    params: { slug: params.slug },
    tags: ['frameworkPage'],
  });
  if (!page) notFound();

  const showIllustration = params.slug === 'digital-blueprint-design';

  return (
    <>
      {/* Hero / intro */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="container-page py-16">
          <div className={showIllustration ? 'grid items-center gap-10 md:grid-cols-2' : ''}>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">{page.title}</h1>
              {page.intro && (
                <div className={`mt-4 text-lg ${showIllustration ? '' : 'max-w-3xl'}`}>
                  <PortableText value={page.intro} />
                </div>
              )}
            </div>
            {showIllustration && (
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <Image
                  src="/digital-blueprint-design.jpg"
                  alt="Isometric blueprint illustration representing the Digital Blueprint Design framework"
                  width={1280}
                  height={853}
                  priority
                  className="h-auto w-full"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content sections */}
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

      {/* CTA */}
      <section className="container-page py-16 text-center">
        <Link href="/book" className="btn-primary">
          {page.ctaLabel || 'Book a Consultation'}
        </Link>
      </section>
    </>
  );
}
