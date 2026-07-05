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
    {
      name: 'hubspotFormId',
      title: 'HubSpot form ID',
      type: 'string',
      description: 'Editable without a code change. Portal ID comes from an env var.',
      group: 'content',
    },
    {
      name: 'hubspotPortalId',
      title: 'HubSpot portal ID (override)',
      type: 'string',
      description: 'Optional. Falls back to NEXT_PUBLIC_HUBSPOT_PORTAL_ID if empty.',
      group: 'content',
    },
    { name: 'email', title: 'Email (fallback)', type: 'string', description: 'Shown as plain text if the embed fails to load.', group: 'content' },
    { name: 'phone', title: 'Phone (fallback)', type: 'string', group: 'content' },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
});
