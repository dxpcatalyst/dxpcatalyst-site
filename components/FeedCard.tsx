import Link from 'next/link';
import type { FeedPost } from '@/lib/beehiiv';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// A single feed card. Beehiiv posts open on Beehiiv in a new tab; Sanity posts
// route internally to /insights/[slug].
export function FeedCard({ post }: { post: FeedPost }) {
  const dateLabel = formatDate(post.publishedAt);
  const inner = (
    <>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {dateLabel && <time>{dateLabel}</time>}
        <span className="rounded-full bg-gray-100 px-2 py-0.5 uppercase tracking-wide">
          {post.source === 'beehiiv' ? 'Newsletter' : 'Article'}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-brand">
        {post.title}
      </h3>
      {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>}
    </>
  );

  const className =
    'group block rounded-lg border border-gray-200 bg-white p-6 transition hover:border-brand hover:shadow-sm';

  if (post.source === 'beehiiv') {
    return (
      <a href={post.url} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={post.url} className={className}>
      {inner}
    </Link>
  );
}
