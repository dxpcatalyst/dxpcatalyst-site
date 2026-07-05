// Newsletter signup CTA — single link to the DXP Catalyst Update Beehiiv signup
// page (spec §2). No embedded form.
export function NewsletterCta({
  headline,
  signupUrl,
  variant = 'strip',
}: {
  headline?: string;
  signupUrl?: string;
  variant?: 'strip' | 'inline';
}) {
  if (!signupUrl) return null;
  const title = headline || 'Subscribe to the DXP Catalyst Update';

  if (variant === 'inline') {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-base font-medium text-gray-900">{title}</p>
        <a
          href={signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4"
        >
          Subscribe
        </a>
      </div>
    );
  }

  return (
    <section className="bg-brand">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-10 text-center sm:flex-row sm:text-left">
        <p className="text-lg font-semibold text-white">{title}</p>
        <a
          href={signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-gray-100"
        >
          Subscribe
        </a>
      </div>
    </section>
  );
}
