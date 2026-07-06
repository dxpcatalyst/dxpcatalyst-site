// Beehiiv public feed. Posts are parsed from the public subdomain HTML at build
// time (no API key — public posts only). See functional spec §2.

export type FeedPost = {
  id: string;
  title: string;
  publishedAt: string | null; // ISO string
  excerpt: string;
  url: string;
  source: 'beehiiv' | 'sanity';
  category: string | null; // Beehiiv content tag / category, or a Sanity tag.
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
    const posts = parseBeehiivHtml(html, subdomainUrl);
    await enrichExcerpts(posts);
    return posts;
  } catch {
    return [];
  }
}

const UA = 'dxpcatalyst-site/1.0 (+https://dxpcatalyst.com)';

// A card blurb is only useful if it actually says something. Beehiiv issues here
// share a generic subtitle ("The DXP Digest"), so treat short/label-like text as
// non-descriptive and fall back to a preview pulled from the post body.
function isDescriptive(s: string): boolean {
  return !!s && s.trim().length > 40 && /\s/.test(s.trim());
}

// For posts without a descriptive subtitle, fetch the post and use the first
// substantive paragraph of the body as the card blurb — the reader's reason to
// click. Best-effort and parallel; failures just leave the blurb empty.
async function enrichExcerpts(posts: FeedPost[]): Promise<void> {
  await Promise.all(
    posts.map(async (p) => {
      if (p.source !== 'beehiiv' || isDescriptive(p.excerpt)) return;
      p.excerpt = await fetchPostPreview(p.url);
    })
  );
}

async function fetchPostPreview(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'user-agent': UA },
    });
    if (!res.ok) return '';
    return extractPostPreview(await res.text());
  } catch {
    return '';
  }
}

// Pull the first real prose paragraph from the rendered post body, skipping
// style/script noise and the boilerplate intro line.
function extractPostPreview(html: string): string {
  const start = html.search(/id=["']content-blocks["']/i);
  const body = start >= 0 ? html.slice(start) : html;
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pRe.exec(body)) !== null) {
    const t = clean(m[1]);
    if (t.length < 60) continue;
    if (/[{}]|line-height|var\s|function\s*\(|undefined|@media/.test(t)) continue;
    if (/^this edition of the dxp catalyst update/i.test(t)) continue;
    return truncate(t, 240);
  }
  return '';
}

// Truncate to a whole word near the limit and append an ellipsis.
function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\s]+$/, '')}…`;
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

  // 2) Fallback: scrape /p/ post links and pull date, category, and title out of
  // the archive listing. Date and title live inside the post's anchor (a <time>
  // and a heading); the category is a sibling chip that Beehiiv renders just
  // *before* each card's anchors, so we match chips by position and attach the
  // nearest one preceding each card. Parsing them separately keeps the card
  // title from ending up glued to the date (e.g. "Jul 1, 2026Title").
  const chips = findCategoryChips(html);
  const anchorRe = /<a[^>]+href=["']([^"']*\/p\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = anchorRe.exec(html)) !== null) {
    const url = absolutize(m[1], baseUrl);
    const card = parseCard(m[2]);
    if (!card.title) continue;
    posts.push({
      id: url,
      title: card.title,
      publishedAt: card.publishedAt,
      excerpt: card.excerpt,
      url,
      source: 'beehiiv',
      // Prefer a chip found inside the anchor; otherwise the nearest chip that
      // appears before this card in the document.
      category: card.category ?? nearestChipBefore(chips, m.index),
    });
  }

  return dedupeAndSort(posts);
}

type Chip = { pos: number; value: string };

// Beehiiv renders each card's category as a small pill:
//   <span class="whitespace-nowrap pb-1 text-xs font-medium">DXP Digest</span>
// Match text-only spans carrying both the `whitespace-nowrap` and `font-medium`
// utility classes (order-independent), which uniquely identifies these chips.
function findCategoryChips(html: string): Chip[] {
  const chips: Chip[] = [];
  const re =
    /<span[^>]*class=["'][^"']*\bwhitespace-nowrap\b[^"']*\bfont-medium\b[^"']*["'][^>]*>([^<]+)<\/span>/gi;
  let c: RegExpExecArray | null;
  while ((c = re.exec(html)) !== null) {
    const value = clean(c[1]);
    if (value) chips.push({ pos: c.index, value });
  }
  return chips;
}

function nearestChipBefore(chips: Chip[], pos: number): string | null {
  let found: string | null = null;
  for (const chip of chips) {
    if (chip.pos < pos) found = chip.value;
    else break;
  }
  return found;
}

// Extract date, category, and title from a single archive card's inner HTML.
function parseCard(inner: string): {
  title: string;
  publishedAt: string | null;
  category: string | null;
  excerpt: string;
} {
  // Date: prefer a machine-readable <time datetime="…">, then <time> text.
  let publishedAt: string | null = null;
  const timeAttr = inner.match(/<time[^>]*\bdatetime=["']([^"']+)["']/i);
  if (timeAttr) publishedAt = normalizeDate(timeAttr[1]);
  if (!publishedAt) {
    const timeText = inner.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
    if (timeText) publishedAt = normalizeDate(clean(timeText[1]));
  }

  // Category: an element flagged as a category/tag/badge, or a link into a
  // /c/ or /t/ (category/tag) archive route.
  let category: string | null = null;
  const catByClass = inner.match(
    /<(?:span|a|div|p)[^>]*class=["'][^"']*(?:categor|\btag\b|badge|pill|eyebrow|topic)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|a|div|p)>/i
  );
  if (catByClass) category = clean(catByClass[1]) || null;
  if (!category) {
    const catByHref = inner.match(
      /<a[^>]*href=["'][^"']*\/(?:c|t|category|categories|tag|tags|topic|topics)\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i
    );
    if (catByHref) category = clean(catByHref[1]) || null;
  }

  // Title: prefer a heading element; otherwise use the leftover text.
  let title = '';
  const heading = inner.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  if (heading) title = clean(heading[1]);
  if (!title) title = clean(inner);

  // Peel a leading date off the title (covers feeds that glue them together),
  // and use it for the date if we didn't find a <time>.
  const { date, rest } = stripLeadingDate(title);
  if (rest) title = rest;
  if (!publishedAt && date) publishedAt = normalizeDate(date);

  // Drop a category label that leaked into the front of the title text.
  if (category && title.toLowerCase().startsWith(category.toLowerCase())) {
    title = title.slice(category.length).replace(/^[\s·•|:–—-]+/, '').trim();
  }

  // Subtitle: the descriptive <p> Beehiiv renders under the card heading. The
  // captured text repeats the title in front of the real subtitle, so peel the
  // title off. Often still generic (e.g. the newsletter section name), in which
  // case it is replaced later by a preview pulled from the post body.
  let excerpt = '';
  const sub = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (sub) excerpt = clean(sub[1]);
  if (excerpt && title && excerpt.startsWith(title)) {
    excerpt = excerpt.slice(title.length).replace(/^[\s·•|:–—-]+/, '').trim();
  }

  return { title, publishedAt, category, excerpt };
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
      const rawTitle = clean(data.headline || data.name || 'Untitled');
      // Some feeds prefix the headline with the date; peel it off so the card
      // can render date and title as separate elements.
      const { date, rest } = stripLeadingDate(rawTitle);
      posts.push({
        id: url,
        title: rest || rawTitle,
        publishedAt: data.datePublished || data.dateCreated || normalizeDate(date),
        excerpt: clean(data.description || ''),
        url,
        source: 'beehiiv',
        category: ldCategory(data),
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

// Strip tags, decode common entities, and collapse whitespace.
function clean(s: string | undefined | null): string {
  if (!s) return '';
  return decodeEntities(stripTags(s)).replace(/\s+/g, ' ').trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘');
}

// Detect and remove a date at the very start of a string. Handles formats like
// "Jul 1, 2026", "July 01, 2026", "Jul 1 2026", optionally followed by a
// separator (·, •, |, –, —, -, :). Returns the matched date text and the rest.
const LEADING_DATE_RE =
  /^\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\s*[·•|:–—-]*\s*/i;

function stripLeadingDate(s: string): { date: string | null; rest: string } {
  const m = s.match(LEADING_DATE_RE);
  if (!m) return { date: null, rest: s };
  return { date: m[1], rest: s.slice(m[0].length).trim() };
}

// Normalize a date string (ISO or human-readable) to an ISO string, or null.
function normalizeDate(text: string | null | undefined): string | null {
  if (!text) return null;
  const t = text.trim();
  if (!t) return null;
  const ms = Date.parse(t);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

// Pull a category from JSON-LD (articleSection, or the first keyword).
function ldCategory(data: any): string | null {
  const section = data.articleSection;
  if (typeof section === 'string' && section.trim()) return clean(section);
  if (Array.isArray(section) && section.length) return clean(String(section[0]));
  const kw = data.keywords;
  if (typeof kw === 'string' && kw.trim()) return clean(kw.split(',')[0]);
  if (Array.isArray(kw) && kw.length) return clean(String(kw[0]));
  return null;
}
