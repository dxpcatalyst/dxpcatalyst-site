// Navigation is hardcoded in Next.js (out of scope: CMS-driven nav). Labels for
// the CTA come from siteSettings; structural links live here.

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'DXP Advisory', href: '/services/dxp-advisory' },
      { label: 'HubSpot and Salesforce Advisory', href: '/services/hubspot-salesforce' },
    ],
  },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];
