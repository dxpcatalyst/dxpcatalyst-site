import Link from 'next/link';
import { SocialLinks } from './SocialLinks';

type FooterSettings = {
  siteName?: string;
  footerTagline?: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
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
    <footer className="mt-20 bg-brand-navy text-gray-300">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          {/* Site name as clean white text on the navy footer. (The available
              reversed logo has a baked black background, so it can't sit
              transparently on navy.) */}
          <Link href="/" className="inline-block text-lg font-semibold text-white">
            {settings.siteName || 'DXP Catalyst'}
          </Link>
          {settings.footerTagline && (
            <p className="mt-3 max-w-xs text-sm text-gray-400">{settings.footerTagline}</p>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm text-gray-300">
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </p>
          )}
          {settings.phone && (
            <p className="mt-1">
              <a href={`tel:${settings.phone}`} className="hover:text-white">
                {settings.phone}
              </a>
            </p>
          )}
          <SocialLinks
            linkedInUrl={settings.linkedInUrl}
            instagramUrl={settings.instagramUrl}
            className="mt-4"
            linkClassName="text-gray-400 transition hover:text-white"
          />
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-4 text-xs text-gray-400">
          © {year} {settings.siteName || 'DXP Catalyst'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
