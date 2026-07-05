import { defineType } from 'sanity';

// Reusable SEO object. If metaTitle is empty the frontend falls back to
// "<page title> | DXP Catalyst" (see lib/seo.ts).
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Leave blank to fall back to the page title + " | DXP Catalyst".',
      validation: (rule) => rule.max(60).warning('Best kept under 60 characters.'),
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('Best kept under 160 characters.'),
    },
  ],
});
