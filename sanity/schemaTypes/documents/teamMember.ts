import { defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'blockContent' },
    { name: 'headshot', title: 'Headshot', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'headshot' },
  },
});
