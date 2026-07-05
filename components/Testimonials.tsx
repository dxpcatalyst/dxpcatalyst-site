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
          <figure key={t._id} className="rounded-lg border border-gray-200 bg-white p-8">
            <blockquote className="text-lg leading-relaxed text-gray-800">
              “{t.quote}”
            </blockquote>
            {t.attribution && (
              <figcaption className="mt-4 text-sm font-medium text-gray-500">
                — {t.attribution}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
