export type Testimonial = {
  _id: string;
  quote: string;
  attribution?: string;
  tag?: 'dxp' | 'crm' | 'general';
};

// Clean blockquote style — quote + attribution only, no photos or ratings (spec §9).
export function Testimonials({ items }: { items?: Testimonial[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="container-page py-16">
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t._id} className="rounded-lg bg-brand-tint p-8">
            <blockquote className="text-lg font-medium leading-relaxed text-brand-charcoal">
              “{t.quote}”
            </blockquote>
            {t.attribution && (
              <figcaption className="mt-4 text-sm text-gray-mid">
                — {t.attribution}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
