import { defineType } from 'sanity';
import { CalendarIcon } from '@sanity/icons';

export const bookingPage = defineType({
  name: 'bookingPage',
  title: 'Book a Consultation Page',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'headline', title: 'Headline', type: 'string', group: 'content', validation: (r) => r.required() },
    { name: 'introText', title: 'Intro text', type: 'string', group: 'content' },
    {
      name: 'hubspotMeetingUrl',
      title: 'HubSpot meeting URL',
      type: 'string',
      description: 'Full scheduler embed URL. Editable without a code change; also used as the plain-text fallback link.',
      group: 'content',
    },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Book a Consultation Page' }),
  },
});
