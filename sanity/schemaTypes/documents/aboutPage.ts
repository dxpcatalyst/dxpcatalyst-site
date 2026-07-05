import { defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'headline', title: 'Headline', type: 'string', group: 'content', validation: (r) => r.required() },
    {
      name: 'introText',
      title: 'Intro',
      type: 'blockContent',
      description: 'Who DXP Catalyst is, background, what drives the practice.',
      group: 'content',
    },
    { name: 'approachHeadline', title: 'Approach headline', type: 'string', group: 'content' },
    {
      name: 'approachText',
      title: 'Our approach',
      type: 'blockContent',
      description: 'How engagements work (flexible, assessment-led).',
      group: 'content',
    },
    {
      name: 'differentiators',
      title: 'Why work with us (differentiators)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    },
    {
      name: 'leadershipTeam',
      title: 'Leadership team',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
      group: 'content',
    },
    { name: 'seo', title: 'SEO', type: 'seo', group: 'seo' },
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
});
