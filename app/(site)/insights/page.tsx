import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { insightsPageQuery, insightPostsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { fetchBeehiivPosts, mergeFeeds, type FeedPost } from '@/lib/beehiiv';
import { InsightsFeed } from '@/components/InsightsFeed';
import { NewsletterCta } from '@/components/NewsletterCta';

// ISR: refresh hourly to pick up new Beehiiv posts (spec §2).
export const revalidate = 3600;

type InsightsPage = {
  headline?: string;
  introText?: string;
  beehiivSubdomainUrl?: string;
  newsletterSignupUrl?: string;
  showSanityPosts?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<InsightsPage>({ query: insightsPageQuery, tags: ['insightsPage'] });
  return buildMetadata({ seo: page?.seo, pageTitle: page?.headline || 'Insights', path: '/insights' });
}

export default async function InsightsPageRoute() {
  const page = (await sanityFetch<InsightsPage>({ query: insightsPageQuery, tags: ['insightsPage'] })) || {};

  // Beehiiv posts (best-effort; [] on failure -> static fallback card below).
  const beehiivPosts = await fetchBeehiivPosts(page.beehiivSubdomainUrl);

  // Sanity-authored posts merged into the same feed.
  let sanityFeed: FeedPost[] = [];
  if (page.showSanityPosts !== false) {
    const sanityPosts = await sanityFetch<any[]>({ query: insightPostsQuery, tags: ['insightPost'] });
    sanityFeed = (sanityPosts || []).map((p) => ({
      id: p._id,
      title: p.title,
      publishedAt: p.publishedAt ?? null,
      excerpt: p.summary || '',
      url: `/insights/${p.slug}`,
      source: 'sanity' as const,
      category: p.tags?.[0] ?? null,
    }));
  }

  const feed = mergeFeeds(beehiivPosts, sanityFeed);
  const beehiivFetchFailed = !!page.beehiivSubdomainUrl && beehiivPosts.length === 0;

  return (
    <>
      <section className="container-page py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {page.headline || 'Insights'}
        </h1>
        {page.introText && <p className="mt-4 max-w-2xl text-lg text-gray-600">{page.introText}</p>}
      </section>

      <section className="container-page pb-8">
        {feed.length > 0 ? (
          <InsightsFeed feed={feed} />
        ) : beehiivFetchFailed ? (
          // Static fallback card with a direct link to the newsletter (spec §2).
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-700">
              Our latest posts live on the DXP Catalyst Update newsletter.
            </p>
            {page.beehiivSubdomainUrl && (
              <a
                href={page.beehiivSubdomainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                Read the newsletter
              </a>
            )}
          </div>
        ) : (
          // Empty state (spec §2).
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-700">New insights are on the way — subscribe to be the first to read them.</p>
          </div>
        )}
      </section>

      <section className="container-page pb-16">
        <NewsletterCta
          headline="Get the DXP Catalyst Update"
          signupUrl={page.newsletterSignupUrl}
          variant="inline"
        />
      </section>
    </>
  );
}
