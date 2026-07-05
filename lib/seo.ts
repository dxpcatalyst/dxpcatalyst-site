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
  const title = seo?.metaTitle?.trim() || `${pageTitle} | ${SITE_NAME}`;
  const description = seo?.metaDescription?.trim() || undefined;
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
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
