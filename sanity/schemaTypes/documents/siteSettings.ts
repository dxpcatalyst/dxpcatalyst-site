import { defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    { name: 'siteName', title: 'Site name', type: 'string', validation: (r) => r.required() },
    { name: 'logoLight', title: 'Logo (light background)', type: 'image', options: { hotspot: true } },
    { name: 'logoDark', title: 'Logo (dark background)', type: 'image', options: { hotspot: true } },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
    { name: 'instagramUrl', title: 'Instagram URL', type: 'url' },
    { name: 'navCtaLabel', title: 'Nav CTA label', type: 'string', description: 'e.g. "Book a Consultation"' },
    { name: 'navCtaUrl', title: 'Nav CTA URL', type: 'string', description: 'e.g. "/book"' },
    { name: 'footerTagline', title: 'Footer tagline', type: 'string' },
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
