import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { bookingPageQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { HubSpotMeetings } from '@/components/HubSpotMeetings';

type BookingPage = {
  headline?: string;
  introText?: string;
  hubspotMeetingUrl?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<BookingPage>({ query: bookingPageQuery, tags: ['bookingPage'] });
  return buildMetadata({ seo: page?.seo, pageTitle: page?.headline || 'Book a Consultation', path: '/book' });
}

export default async function BookPageRoute() {
  const page = (await sanityFetch<BookingPage>({ query: bookingPageQuery, tags: ['bookingPage'] })) || {};

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {page.headline || 'Book a Consultation'}
        </h1>
        {page.introText && <p className="mt-4 text-lg text-gray-600">{page.introText}</p>}

        <div className="mt-10">
          <HubSpotMeetings meetingUrl={page.hubspotMeetingUrl} />
        </div>
      </div>
    </section>
  );
}
