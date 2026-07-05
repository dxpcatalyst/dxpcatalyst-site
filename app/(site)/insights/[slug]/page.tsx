import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { insightPostBySlugQuery, insightPostSlugsQuery } from '@/sanity/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableText } from '@/components/PortableText';
import { urlForImage } from '@/sanity/lib/image';

type InsightPost = {
  title?: string;
  slug?: string;
  publishedAt?: string;
  summary?: string;
  body?: any;
  tags?: string[];
  featuredImage?: any;
  author?: { name?: string; title?: string };
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: insightPostSlugsQuery,
    tags: ['insightPost'],
  });
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await sanityFetch<InsightPost>({
    query: insightPostBySlugQuery,
    params: { slug: params.slug },
    tags: ['insightPost'],
  });
  if (!post) return {};
  return buildMetadata({
    seo: post.seo,
    pageTitle: post.title || 'Insight',
    path: `/insights/${params.slug}`,
  });
}

export default async function InsightPostRoute({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<InsightPost>({
    query: insightPostBySlugQuery,
    params: { slug: params.slug },
    tags: ['insightPost'],
  });
  if (!post) notFound();

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {dateLabel && <time>{dateLabel}</time>}
          {post.author?.name && <span>· {post.author.name}</span>}
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">{post.title}</h1>
        {post.summary && <p className="mt-4 text-lg text-gray-600">{post.summary}</p>}

        {post.featuredImage && (
          <Image
            src={urlForImage(post.featuredImage).width(1200).height(675).fit('crop').auto('format').url()}
            alt={post.featuredImage?.alt || post.title || ''}
            width={1200}
            height={675}
            className="mt-8 h-auto w-full rounded-lg"
            priority
          />
        )}

        {post.body && (
          <div className="mt-8">
            <PortableText value={post.body} />
          </div>
        )}
      </div>
    </article>
  );
}
