import type { Metadata } from 'next';
import Image from 'next/image';
import { sanityFetch } from '@/sanity/lib/fetch';
import { aboutPageQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';
import { urlForImage } from '@/sanity/lib/image';

type TeamMember = {
  _id: string;
  name: string;
  title?: string;
  bio?: any;
  headshot?: any;
  linkedInUrl?: string;
};

type AboutPage = {
  headline?: string;
  introText?: any;
  approachHeadline?: string;
  approachText?: any;
  differentiators?: { title?: string; description?: string }[];
  leadershipTeam?: TeamMember[];
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const about = await sanityFetch<AboutPage>({ query: aboutPageQuery, tags: ['aboutPage'] });
  return buildMetadata({ seo: about?.seo, pageTitle: about?.headline || 'About', path: '/about' });
}

export default async function AboutPageRoute() {
  const about = (await sanityFetch<AboutPage>({ query: aboutPageQuery, tags: ['aboutPage'] })) || {};

  return (
    <>
      <section className="container-page py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {about.headline || 'About DXP Catalyst'}
        </h1>
        {about.introText && (
          <div className="mt-6 max-w-3xl">
            <PortableText value={about.introText} />
          </div>
        )}
      </section>

      {about.approachText && (
        <section className="bg-gray-50">
          <div className="container-page py-16">
            <h2 className="text-2xl font-semibold text-gray-900">
              {about.approachHeadline || 'Our approach'}
            </h2>
            <div className="mt-4 max-w-3xl">
              <PortableText value={about.approachText} />
            </div>
          </div>
        </section>
      )}

      {about.differentiators && about.differentiators.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Why work with us</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {about.differentiators.map((d, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">{d.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{d.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {about.leadershipTeam && about.leadershipTeam.length > 0 && (
        <section className="bg-gray-50">
          <div className="container-page py-16">
            <h2 className="text-2xl font-semibold text-gray-900">Leadership</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {about.leadershipTeam.map((m) => (
                <div key={m._id} className="flex gap-5 rounded-lg bg-white p-6">
                  {m.headshot && (
                    <Image
                      src={urlForImage(m.headshot).width(160).height(160).fit('crop').auto('format').url()}
                      alt={m.headshot?.alt || m.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 flex-shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{m.name}</h3>
                    {m.title && <p className="text-sm text-gray-500">{m.title}</p>}
                    {m.bio && (
                      <div className="mt-2 text-sm">
                        <PortableText value={m.bio} />
                      </div>
                    )}
                    {m.linkedInUrl && (
                      <a
                        href={m.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-brand hover:underline"
                      >
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
