import { defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'heroHeadline', title: 'Hero headline', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'heroSubheadline', title: 'Hero subheadline', type: 'string', group: 'content' },
    { name: 'heroCtaLabel', title: 'Hero CTA label', type: 'string', group: 'content' },
    { name: 'heroCtaUrl', title: 'Hero CTA URL', type: 'string', group: 'content' },
    {
      name: 'positioningText',
      title: 'Positioning statement',
      type: 'blockContent',
      description: 'Who we work with, what we help them accomplish.',
      group: 'content',
    },
    {
      name: 'howWeWorkText',
      title: 'How we work',
      type: 'blockContent',
      description: 'How engagements are shaped around what the client actually needs.',
      group: 'content',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      group: 'content',
    },
    {
      name: 'showInsightsPreview',
      title: 'Show Insights preview',
      type: 'boolean',
      description: 'Show 3 latest posts from DXP Catalyst Update.',
      initialValue: true,
      group: 'content',
    },
    { name: 'newsletterStripHeadline', title: 'Newsletter strip headline', type: 'string', group: 'content' },
    { name: 'newsletterSignupUrl', title: 'Newsletter signup URL', type: 'string', description: 'Beehiiv signup page.', group: 'content' },
    { name: 'ctaBannerText', title: 'CTA banner text', type: 'string', group: 'content' },
    { name: 'ctaBannerCtaLabel', title: 'CTA banner button label', type: 'string', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
});
