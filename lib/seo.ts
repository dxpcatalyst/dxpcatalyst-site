import type { Metadata } from 'next';

export const SITE_NAME = 'DXP Catalyst';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://dxpcatalyst.com';

type SeoInput = {
  metaTitle?: string | null;
  metaDescription?: string | null;
} | null | undefined;

// Build Next.js Metadata from a page's `seo` object with the spec's fallbacks:
// if seo.metaTitle is empty, use "<page title> | DXP Catalyst".
export function buildMetadata({
  seo,
  pageTitle,
  path = '/',
}: {
  seo?: SeoInput;
  pageTitle: string;
  path?: string;
}): Metadata {
  // Compute the full title. Avoid duplicating the brand when the page title is
  // already the site name (homepage). Return it as `absolute` so the root
  // layout's title.template ("%s | DXP Catalyst") does not re-wrap it.
  const title =
    seo?.metaTitle?.trim() ||
    (pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} | ${SITE_NAME}`);
  const description = seo?.metaDescription?.trim() || undefined;
  const url = new URL(path, SITE_URL).toString();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
