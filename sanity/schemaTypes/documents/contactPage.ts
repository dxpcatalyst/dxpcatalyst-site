import { defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'headline', title: 'Headline', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'introText', title: 'Intro text', type: 'string', group: 'content' },
    { name: 'email', title: 'Email', type: 'string', description: 'Shown as a direct-contact link below the scheduler.', group: 'content' },
    { name: 'phone', title: 'Phone (fallback)', type: 'string', group: 'content' },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Shown as plain text and used to pre-populate the map embed. Leave blank to show a default-location map.',
      group: 'content',
    },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
});
