import { defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

// Privacy Policy (/privacy).
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Privacy Policy',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'body', title: 'Body', type: 'blockContent', group: 'content' },
    { name: 'lastUpdated', title: 'Last updated', type: 'date', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Privacy Policy' }),
  },
});
