import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { contactPageQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { HubSpotForm } from '@/components/HubSpotForm';

type ContactPage = {
  headline?: string;
  introText?: string;
  hubspotFormId?: string;
  hubspotPortalId?: string;
  email?: string;
  phone?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
};

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
          <HubSpotForm
            portalId={page.hubspotPortalId}
            formId={page.hubspotFormId}
            email={page.email}
            phone={page.phone}
          />
        </div>
      </div>
    </section>
  );
}
