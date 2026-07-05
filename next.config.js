/** @type {import('next').NextConfig} */

// Redirect map from old WordPress URLs (page inventory doc).
// All permanent (308) redirects, applied at go-live.
const redirectMap = [
  ['/company-overview/', '/about'],
  ['/company-overview/our-approach/', '/about'],
  ['/company-overview/our-expertise/', '/about'],
  ['/company-overview/why-choose-us/', '/about'],
  ['/company-overview/leadership/', '/about'],
  ['/enterprise-services/', '/services/dxp-advisory'],
  ['/services/digital-blueprint-design/', '/services/dxp-advisory'],
  ['/service/martech-evaluation/', '/services/dxp-advisory'],
  ['/service/digital-platforms-requirements-gathering/', '/services/dxp-advisory'],
  ['/service/digital-platform-assessment-recommendation/', '/services/dxp-advisory'],
  ['/service/enterprise-solution-architecture-design/', '/services/dxp-advisory'],
  ['/service/consulting-ongoing-support/', '/services/dxp-advisory'],
  ['/small-business-services/', '/services/hubspot-salesforce'],
  ['/service/website-portal-development/', '/'],
  ['/service/hubspot-sales-hub-setup-sales-enablement/', '/services/hubspot-salesforce'],
  ['/service/hubspot-marketing-activation/', '/services/hubspot-salesforce'],
  ['/service/fractional-cio-support/', '/'],
  ['/insights-hub/', '/insights'],
  ['/contact-us/', '/contact'],
  ['/book-consultation/', '/book'],
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async redirects() {
    return redirectMap.map(([source, destination]) => ({
      source,
      destination,
      permanent: true, // 308
    }));
  },
};

module.exports = nextConfig;
