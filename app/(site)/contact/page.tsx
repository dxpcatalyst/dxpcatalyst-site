import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { contactPageQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { HubSpotMeetings } from '@/components/HubSpotMeetings';

type ContactPage = {
  headline?: string;
  introText?: string;
  email?: string;
  phone?: string;
  address?: string;
  meetingUrl?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

// Location shown when no address is configured, so the map section still
// renders something sensible instead of an empty box.
const FALLBACK_MAP_LOCATION = 'New York, NY';

// Keyless Google Maps embed: pre-populates the map with a search query.
function mapEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ContactPage>({ query: contactPageQuery, tags: ['contactPage'] });
  return buildMetadata({ seo: page?.seo, pageTitle: page?.headline || 'Contact', path: '/contact' });
}

export default async function ContactPageRoute() {
  const page = (await sanityFetch<ContactPage>({ query: contactPageQuery, tags: ['contactPage'] })) || {};

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {page.headline || 'Contact us'}
        </h1>
        {page.introText && <p className="mt-4 text-lg text-gray-600">{page.introText}</p>}

        <div className="mt-10">
          <HubSpotMeetings meetingUrl={page.meetingUrl} />
        </div>

        {(page.email || page.phone) && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Prefer to reach us directly?
            </h2>
            <ul className="mt-2 space-y-1 text-gray-700">
              {page.email && (
                <li>
                  <a href={`mailto:${page.email}`} className="text-brand hover:underline">
                    {page.email}
                  </a>
                </li>
              )}
              {page.phone && (
                <li>
                  <a href={`tel:${page.phone}`} className="text-brand hover:underline">
                    {page.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-12">
          {page.address ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Visit us
              </h2>
              <address className="mt-2 not-italic text-gray-700">{page.address}</address>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <iframe
                  title={`Map showing ${page.address}`}
                  src={mapEmbedSrc(page.address)}
                  width="100%"
                  height="320"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            </>
          ) : (
            // Fallback: address not configured — show a default-location map.
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <iframe
                title="Map"
                src={mapEmbedSrc(FALLBACK_MAP_LOCATION)}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
