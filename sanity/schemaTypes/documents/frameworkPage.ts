import { defineType } from 'sanity';
import { ComponentIcon } from '@sanity/icons';

// Framework / methodology pages (e.g. "Digital Blueprint Design"). Referenced
// from service pages. Same uniform body shape as servicePage: an intro plus an
// ordered list of headed sections.
export const frameworkPage = defineType({
  name: 'frameworkPage',
  title: 'Framework Page',
  type: 'document',
  icon: ComponentIcon,
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
    { name: 'intro', title: 'Intro', type: 'blockContent', description: 'Opening statement of what the framework is.', group: 'content' },
    {
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      group: 'content',
      description: 'The body of the page: an ordered list of headed sections.',
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
    { name: 'ctaLabel', title: 'CTA label', type: 'string', initialValue: 'Book a Consultation', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/frameworks/${subtitle}` : undefined }),
  },
});
