import Link from 'next/link';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { homePageQuery, insightPostsQuery, serviceOfferingsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';
import { Testimonials, type Testimonial } from '@/components/Testimonials';
import { NewsletterCta } from '@/components/NewsletterCta';
import { FeedCard } from '@/components/FeedCard';
import type { FeedPost } from '@/lib/beehiiv';

type HomePage = {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaLabel?: string;
  heroCtaUrl?: string;
  positioningText?: any;
  howWeWorkText?: any;
  showInsightsPreview?: boolean;
  newsletterStripHeadline?: string;
  newsletterSignupUrl?: string;
  ctaBannerText?: string;
  ctaBannerCtaLabel?: string;
  testimonials?: Testimonial[];
  seo?: { metaTitle?: string; metaDescription?: string };
};

type Offering = { title?: string; slug?: string; summary?: string };

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<HomePage>({ query: homePageQuery, tags: ['homePage'] });
  return buildMetadata({ seo: home?.seo, pageTitle: 'DXP Catalyst', path: '/' });
}

export default async function HomePageRoute() {
  const home = (await sanityFetch<HomePage>({ query: homePageQuery, tags: ['homePage'] })) || {};
  const offerings =
    (await sanityFetch<Offering[]>({ query: serviceOfferingsQuery, tags: ['servicePage'] })) || [];

  let previewPosts: FeedPost[] = [];
  if (home.showInsightsPreview) {
    const sanityPosts = await sanityFetch<any[]>({ query: insightPostsQuery, tags: ['insightPost'] });
    previewPosts = (sanityPosts || []).slice(0, 3).map((p) => ({
      id: p._id,
      title: p.title,
      publishedAt: p.publishedAt ?? null,
      excerpt: p.summary || '',
      url: `/insights/${p.slug}`,
      source: 'sanity' as const,
      category: p.tags?.[0] ?? null,
    }));
  }

  return (
    <>
      {/* Hero — dark navy (design tokens §1) */}
      <section className="relative overflow-hidden bg-brand-navy">
        {/* Decorative blueprint motif — inline SVG, aria-hidden, negligible weight */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 640"
          fill="none"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" stroke="#285197" strokeWidth="1" />
            </pattern>
            <radialGradient id="hero-fade" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="#1A1F2E" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#1A1F2E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A1F2E" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* faint blueprint grid */}
          <rect width="1440" height="640" fill="url(#hero-grid)" opacity="0.14" />
          {/* vignette keeps the headline crisp, motif concentrated at the edges */}
          <rect width="1440" height="640" fill="url(#hero-fade)" />
          {/* right-side isometric node cluster (hidden on small screens) */}
          <g className="hidden md:block" opacity="0.55">
            <g stroke="#4C7AC4" strokeWidth="1.5">
              <path d="M1180 205 L1250 170 L1320 205 L1320 280 L1250 315 L1180 280 Z" />
              <path d="M1180 205 L1250 240 L1320 205" />
              <path d="M1250 240 L1250 315" />
              <path d="M1250 315 L1250 398 L1122 440" strokeDasharray="4 7" />
              <path d="M1320 280 L1392 316" strokeDasharray="4 7" />
            </g>
            <g fill="#4C7AC4">
              <circle cx="1250" cy="170" r="3" />
              <circle cx="1250" cy="398" r="4" />
              <circle cx="1122" cy="440" r="4" />
              <circle cx="1392" cy="316" r="4" />
            </g>
          </g>
        </svg>
        <div className="container-page relative py-20 text-center md:py-28">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            {home.heroHeadline || 'Modernize your digital ecosystem'}
          </h1>
          {home.heroSubheadline && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">{home.heroSubheadline}</p>
          )}
          <div className="mt-8">
            <Link href={home.heroCtaUrl || '/book'} className="btn-primary">
              {home.heroCtaLabel || 'Book a Consultation'}
            </Link>
          </div>
        </div>
      </section>

      {/* Positioning statement */}
      {home.positioningText && (
        <section className="container-page py-16">
          <div className="mx-auto max-w-3xl text-center text-xl text-gray-700">
            <PortableText value={home.positioningText} />
          </div>
        </section>
      )}

      {/* Offering cards — sourced from the servicePage documents in Sanity */}
      {offerings.length > 0 && (
        <section className="container-page py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {offerings.map((o) => (
              <Link
                key={o.slug}
                href={`/services/${o.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-8 transition hover:border-brand hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand">{o.title}</h2>
                {o.summary && <p className="mt-3 text-gray-600">{o.summary}</p>}
                <span className="mt-4 inline-block text-sm font-medium text-brand">Learn more →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How we work */}
      {home.howWeWorkText && (
        <section className="bg-gray-50">
          <div className="container-page py-16">
            <h2 className="text-2xl font-semibold text-gray-900">How we work</h2>
            <div className="mt-4 max-w-3xl">
              <PortableText value={home.howWeWorkText} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials items={home.testimonials} />

      {/* Insights preview */}
      {home.showInsightsPreview && previewPosts.length > 0 && (
        <section className="container-page py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Latest insights</h2>
            <Link href="/insights" className="text-sm font-medium text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {previewPosts.map((p) => (
              <FeedCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter strip */}
      <NewsletterCta headline={home.newsletterStripHeadline} signupUrl={home.newsletterSignupUrl} variant="strip" />

      {/* CTA banner — dark navy band */}
      <section className="bg-brand-navy">
        <div className="container-page py-20 text-center">
          <h2 className="text-2xl font-bold text-white">
            {home.ctaBannerText || 'Ready to talk?'}
          </h2>
          <div className="mt-6">
            <Link href="/book" className="btn-primary">
              {home.ctaBannerCtaLabel || 'Book a Consultation'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
