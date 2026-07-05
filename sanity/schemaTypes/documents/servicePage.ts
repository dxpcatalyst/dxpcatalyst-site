import { defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons';

// Two documents at launch: "DXP Advisory" (/services/dxp-advisory) and
// "HubSpot and Salesforce Advisory" (/services/hubspot-salesforce).
export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  icon: CaseIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    },
    { name: 'heroText', title: 'Hero', type: 'blockContent', description: 'Clear statement of what this offering is.', group: 'content' },
    {
      name: 'progressionText',
      title: 'Progression',
      type: 'blockContent',
      description: 'How the work flows as a connected process, not a menu of services.',
      group: 'content',
    },
    {
      name: 'progressionPhases',
      title: 'Progression phases',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'phase', title: 'Phase', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
          preview: { select: { title: 'phase', subtitle: 'description' } },
        },
      ],
    },
    {
      name: 'twoTrackCallout',
      title: 'Two-track callout',
      type: 'object',
      group: 'content',
      description: 'e.g. composable vs. pre-composed framework, with supporting article.',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'body', title: 'Body', type: 'text', rows: 3 },
        { name: 'articleUrl', title: 'Article URL', type: 'url' },
      ],
    },
    { name: 'engagementModelText', title: 'Engagement model', type: 'blockContent', group: 'content' },
    { name: 'whoThisIsForText', title: 'Who this is for', type: 'string', group: 'content' },
    {
      name: 'representativeWork',
      title: 'Representative work',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: { select: { title: 'label', subtitle: 'description' } },
        },
      ],
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Reference testimonials; filter by matching tag (dxp / crm) on the frontend.',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      group: 'content',
    },
    { name: 'ctaLabel', title: 'CTA label', type: 'string', initialValue: 'Book a Consultation', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/services/${subtitle}` : undefined }),
  },
});
