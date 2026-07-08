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

  const heroMotif = params.slug === 'dxp-advisory' ? 'dxp' : tag === 'crm' ? 'crm' : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className={`container-page pt-16 pb-16 ${heroMotif ? 'md:pb-6' : ''}`}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{page.title}</h1>
          {page.heroText && (
            <div className="mt-4 max-w-3xl text-lg">
              <PortableText value={page.heroText} />
            </div>
          )}
          {heroMotif && (
            <div className="mt-6 hidden max-w-3xl md:block" aria-hidden="true">
              <ServiceHeroBand variant={heroMotif} />
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

// Decorative, brand-blue blueprint band for the service hero — a wide, short
// composition that fills the space between the intro and the content. Inline
// SVG, aria-hidden, negligible weight. DXP Advisory gets a CMS-anchored
// ecosystem; CRM gets a two-system data flow.
function ServiceHeroBand({ variant }: { variant: 'dxp' | 'crm' }) {
  if (variant === 'dxp') {
    const cx = 430;
    const cy = 75;
    // Satellite nodes packed around the central hub.
    const sats = [
      { x: 70, y: 44 },
      { x: 180, y: 108 },
      { x: 300, y: 36 },
      { x: 360, y: 116 },
      { x: 500, y: 116 },
      { x: 560, y: 36 },
      { x: 680, y: 108 },
      { x: 790, y: 44 },
    ];
    return (
      <svg viewBox="0 24 860 104" fill="none" className="w-full">
        <g stroke="#285197" strokeWidth="1.5" opacity="0.38">
          {sats.map((s, i) => (
            <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y} />
          ))}
        </g>
        <g stroke="#285197" strokeWidth="1.25" strokeDasharray="3 7" opacity="0.28">
          <path d="M70 44 L180 108" />
          <path d="M300 36 L360 116" />
          <path d="M560 36 L500 116" />
          <path d="M790 44 L680 108" />
        </g>
        {/* central hub (the CMS anchor) */}
        <rect x="403" y="48" width="54" height="54" rx="8" stroke="#285197" strokeWidth="2" opacity="0.9" />
        <rect x="415" y="60" width="30" height="30" rx="4" stroke="#285197" strokeWidth="1.25" opacity="0.5" />
        <g fill="#285197" opacity="0.85">
          {sats.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r="6" />
          ))}
        </g>
      </svg>
    );
  }
  // crm: two systems exchanging records.
  return (
    <svg viewBox="0 0 860 150" fill="none" className="w-full">
      <g stroke="#285197" strokeWidth="2" opacity="0.9">
        <rect x="30" y="40" width="120" height="70" rx="10" />
        <rect x="710" y="40" width="120" height="70" rx="10" />
      </g>
      <g stroke="#285197" strokeWidth="1.5" opacity="0.4">
        <line x1="48" y1="60" x2="132" y2="60" />
        <line x1="48" y1="75" x2="132" y2="75" />
        <line x1="48" y1="90" x2="132" y2="90" />
        <line x1="728" y1="60" x2="812" y2="60" />
        <line x1="728" y1="75" x2="812" y2="75" />
        <line x1="728" y1="90" x2="812" y2="90" />
      </g>
      <g stroke="#285197" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.5">
        <path d="M150 64 C 360 64, 500 86, 710 86" />
        <path d="M150 86 C 360 86, 500 64, 710 64" />
      </g>
      <g fill="#285197" opacity="0.85">
        <circle cx="360" cy="75" r="4" />
        <circle cx="430" cy="75" r="5.5" />
        <circle cx="500" cy="75" r="4" />
      </g>
    </svg>
  );
}
