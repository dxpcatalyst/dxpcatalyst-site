import { defineType } from 'sanity';
import { TrendUpwardIcon } from '@sanity/icons';

// URL: /work/[slug]. Two at launch: Risepoint (DXP Advisory) and
// Cornerstone Financing (HubSpot and Salesforce Advisory).
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: TrendUpwardIcon,
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
    {
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      description: 'Placeholder if not yet approved for public use.',
      group: 'content',
    },
    { name: 'clientType', title: 'Client type', type: 'string', description: "e.g. 'PE-backed EdTech', 'Growth-stage financial services'.", group: 'content' },
    { name: 'industry', title: 'Industry', type: 'string', group: 'content' },
    {
      name: 'facts',
      title: 'At a glance',
      type: 'array',
      group: 'content',
      description: 'Quick engagement facts shown as a meta strip (e.g. Engagement, Location, Company size, Project type).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    },
    { name: 'publishedAt', title: 'Published at', type: 'datetime', group: 'content' },
    {
      name: 'relatedOffering',
      title: 'Related offering',
      type: 'reference',
      to: [{ type: 'servicePage' }],
      description: 'Links back to the relevant service page.',
      group: 'content',
    },
    { name: 'challenge', title: 'The challenge', type: 'blockContent', group: 'content' },
    { name: 'whatWeDid', title: 'What we did', type: 'blockContent', group: 'content' },
    { name: 'outcome', title: 'Outcome', type: 'blockContent', group: 'content' },
    { name: 'isAnonymized', title: 'Anonymized', type: 'boolean', initialValue: false, group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  orderings: [
    { title: 'Published, newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', client: 'clientName', industry: 'industry' },
    prepare: ({ title, client, industry }) => ({
      title: title || client || 'Case Study',
      subtitle: [client, industry].filter(Boolean).join(' · ') || undefined,
    }),
  },
});
