// Beehiiv public feed. Posts are parsed from the public subdomain HTML at build
// time (no API key — public posts only). See functional spec §2.

export type FeedPost = {
  id: string;
  title: string;
  publishedAt: string | null; // ISO string
  excerpt: string;
  url: string;
  source: 'beehiiv' | 'sanity';
};

// Fetch + parse the latest posts from a Beehiiv public subdomain.
// Returns [] on any failure so the caller can render a static fallback.
export async function fetchBeehiivPosts(
  subdomainUrl: string | undefined | null
): Promise<FeedPost[]> {
  if (!subdomainUrl) return [];

  try {
    const res = await fetch(subdomainUrl, {
      // ISR: refresh hourly (spec §2).
      next: { revalidate: 3600 },
      headers: { 'user-agent': 'dxpcatalyst-site/1.0 (+https://dxpcatalyst.com)' },
    });
    if (!res.ok) return [];
    const html = await res.text();
    return parseBeehiivHtml(html, subdomainUrl);
  } catch {
    return [];
  }
}

// Best-effort parse. Beehiiv embeds post metadata as JSON-LD and/or Next.js
// data; we try JSON-LD first, then fall back to anchor scraping. Kept resilient
// because the public markup is outside our control.
function parseBeehiivHtml(html: string, baseUrl: string): FeedPost[] {
  const posts: FeedPost[] = [];

  // 1) JSON-LD BlogPosting / Article entries.
  const ldMatches = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (ldMatches) {
    for (const block of ldMatches) {
      const jsonText = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
      try {
        const data = JSON.parse(jsonText);
        collectFromLd(data, posts);
      } catch {
        // ignore malformed block
      }
    }
  }

  if (posts.length > 0) {
    return dedupeAndSort(posts);
  }

  // 2) Fallback: scrape /p/ post links with their anchor text.
  const anchorRe = /<a[^>]+href=["']([^"']*\/p\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = anchorRe.exec(html)) !== null) {
    const url = absolutize(m[1], baseUrl);
    const title = stripTags(m[2]).trim();
    if (!title) continue;
    posts.push({
      id: url,
      title,
      publishedAt: null,
      excerpt: '',
      url,
      source: 'beehiiv',
    });
  }

  return dedupeAndSort(posts);
}

function collectFromLd(data: any, posts: FeedPost[]) {
  if (!data) return;
  if (Array.isArray(data)) {
    data.forEach((d) => collectFromLd(d, posts));
    return;
  }
  if (data['@graph']) {
    collectFromLd(data['@graph'], posts);
    return;
  }
  const type = data['@type'];
  const isPost =
    type === 'BlogPosting' ||
    type === 'Article' ||
    (Array.isArray(type) && type.some((t) => t === 'BlogPosting' || t === 'Article'));
  if (isPost && (data.url || data.mainEntityOfPage)) {
    const url =
      typeof data.url === 'string'
        ? data.url
        : data.mainEntityOfPage?.['@id'] || data.mainEntityOfPage;
    if (typeof url === 'string') {
      posts.push({
        id: url,
        title: data.headline || data.name || 'Untitled',
        publishedAt: data.datePublished || data.dateCreated || null,
        excerpt: data.description || '',
        url,
        source: 'beehiiv',
      });
    }
  }
}

function dedupeAndSort(posts: FeedPost[]): FeedPost[] {
  const seen = new Set<string>();
  const unique = posts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  return sortByDateDesc(unique);
}

// Merge Beehiiv + Sanity-authored posts into one feed, sorted by date desc.
export function mergeFeeds(a: FeedPost[], b: FeedPost[]): FeedPost[] {
  return sortByDateDesc([...a, ...b]);
}

function sortByDateDesc(posts: FeedPost[]): FeedPost[] {
  return [...posts].sort((x, y) => {
    const tx = x.publishedAt ? Date.parse(x.publishedAt) : 0;
    const ty = y.publishedAt ? Date.parse(y.publishedAt) : 0;
    return ty - tx;
  });
}

function absolutize(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}
