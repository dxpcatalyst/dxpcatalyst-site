import { defineType } from 'sanity';
import { CommentIcon } from '@sanity/icons';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    { name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() },
    {
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Name, title, company — e.g. "Jane Doe, VP Marketing, Acme".',
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          { title: 'DXP', value: 'dxp' },
          { title: 'CRM', value: 'crm' },
          { title: 'General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'attribution', subtitle: 'tag', quote: 'quote' },
    prepare: ({ title, subtitle, quote }) => ({
      title: title || quote?.slice(0, 40) || 'Testimonial',
      subtitle: subtitle ? `Tag: ${subtitle}` : undefined,
    }),
  },
});
