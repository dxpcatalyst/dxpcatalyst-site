'use client';

import { useMemo, useState } from 'react';
import type { FeedPost } from '@/lib/beehiiv';
import { FeedCard } from '@/components/FeedCard';

const ALL = '__all__';

// Client-side category filtering for the Insights feed. The full feed is
// rendered server-side and passed in; filtering happens in the browser with no
// page reload. Active filter uses the brand blue.
export function InsightsFeed({ feed }: { feed: FeedPost[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const post of feed) {
      if (post.category) set.add(post.category);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [feed]);

  const [active, setActive] = useState<string>(ALL);

  // Guard against a stale selection if the feed changes on ISR revalidate.
  const current = active !== ALL && !categories.includes(active) ? ALL : active;

  const visible = useMemo(
    () => (current === ALL ? feed : feed.filter((p) => p.category === current)),
    [feed, current]
  );

  const showFilters = categories.length > 1;

  return (
    <div>
      {showFilters && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter insights by category">
          <FilterButton label="All" active={current === ALL} onClick={() => setActive(ALL)} />
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              label={cat}
              active={current === cat}
              onClick={() => setActive(cat)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ' +
        (active
          ? 'bg-brand text-white'
          : 'border border-gray-300 text-gray-700 hover:border-brand hover:text-brand')
      }
    >
      {label}
    </button>
  );
}
