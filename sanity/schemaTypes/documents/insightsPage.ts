import { defineType } from 'sanity';
import { DocumentsIcon } from '@sanity/icons';

// Page config only — the feed is fetched at build time (Beehiiv + Sanity posts).
export const insightsPage = defineType({
  name: 'insightsPage',
  title: 'Insights Page',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'headline', title: 'Headline', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'introText', title: 'Intro text', type: 'string', group: 'content' },
    {
      name: 'beehiivSubdomainUrl',
      title: 'Beehiiv subdomain URL',
      type: 'string',
      description: 'Public DXP Catalyst Update subdomain, parsed at build time.',
      group: 'content',
    },
    { name: 'newsletterSignupUrl', title: 'Newsletter signup URL', type: 'string', description: 'Beehiiv hosted signup page.', group: 'content' },
    {
      name: 'showSanityPosts',
      title: 'Merge Sanity-authored posts into feed',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Insights Page' }),
  },
});
