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
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      group: 'content',
      description:
        'The body of the page: an ordered list of headed sections (capabilities, how the work flows, engagement model, who it is for, etc.). Both service pages share this structure and differ only in the sections they use.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body', type: 'blockContent' },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    },
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
