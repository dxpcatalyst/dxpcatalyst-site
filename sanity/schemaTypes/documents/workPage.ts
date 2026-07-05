import { defineType } from 'sanity';
import { ThLargeIcon } from '@sanity/icons';

// Case study index page config (/work). Cards are queried from caseStudy docs.
export const workPage = defineType({
  name: 'workPage',
  title: 'Work Index Page',
  type: 'document',
  icon: ThLargeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'headline', title: 'Headline', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'introText', title: 'Intro text', type: 'string', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Work Index Page' }),
  },
});
