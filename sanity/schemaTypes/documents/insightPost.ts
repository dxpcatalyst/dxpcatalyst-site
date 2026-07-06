import { defineType } from 'sanity';
import { EditIcon } from '@sanity/icons';

// Original content authored directly in Sanity (not via Beehiiv). URL: /insights/[slug].
export const insightPost = defineType({
  name: 'insightPost',
  title: 'Insight Post',
  type: 'document',
  icon: EditIcon,
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
    { name: 'publishedAt', title: 'Published at', type: 'datetime', group: 'content', validation: (r) => r.required() },
    { name: 'author', title: 'Author', type: 'reference', to: [{ type: 'teamMember' }], group: 'content' },
    { name: 'summary', title: 'Summary', type: 'string', description: 'Excerpt shown in the feed.', group: 'content' },
    { name: 'body', title: 'Body', type: 'blockContent', group: 'content' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, group: 'content' },
    { name: 'featuredImage', title: 'Featured image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }], group: 'content' },
    {
      name: 'originalUrl',
      title: 'Originally published at (URL)',
      type: 'url',
      description: 'If this article first appeared elsewhere, the original URL. Shown as a credit at the bottom of the article.',
      group: 'content',
    },
    {
      name: 'originalSourceName',
      title: 'Original publication name',
      type: 'string',
      description: "Publication name shown in the credit, e.g. 'CMS Critic'. Falls back to the URL's domain.",
      group: 'content',
    },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  orderings: [
    { title: 'Published, newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'featuredImage' },
  },
});
