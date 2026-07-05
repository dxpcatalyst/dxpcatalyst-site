import {
  PortableText as PT,
  type PortableTextComponents,
} from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).fit('max').auto('format').url();
      return (
        <Image
          src={url}
          alt={value.alt || ''}
          width={1200}
          height={675}
          className="my-6 h-auto w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableText({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value || value.length === 0) return null;
  return (
    <div className="prose-dxp">
      <PT value={value} components={components} />
    </div>
  );
}
