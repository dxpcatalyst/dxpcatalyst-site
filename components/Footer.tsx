import Link from 'next/link';

type FooterSettings = {
  siteName?: string;
  footerTagline?: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
};

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'DXP Advisory', href: '/services/dxp-advisory' },
  { label: 'HubSpot & Salesforce', href: '/services/hubspot-salesforce' },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];

export function Footer({ settings }: { settings: FooterSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-semibold text-brand">{settings.siteName || 'DXP Catalyst'}</p>
          {settings.footerTagline && (
            <p className="mt-2 max-w-xs text-sm text-gray-600">{settings.footerTagline}</p>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-700 hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm text-gray-700">
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-brand">
                {settings.email}
              </a>
            </p>
          )}
          {settings.phone && (
            <p className="mt-1">
              <a href={`tel:${settings.phone}`} className="hover:text-brand">
                {settings.phone}
              </a>
            </p>
          )}
          {settings.linkedInUrl && (
            <p className="mt-3">
              <a
                href={settings.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200">
        <p className="container-page py-4 text-xs text-gray-500">
          © {year} {settings.siteName || 'DXP Catalyst'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
