/** @type {import('next').NextConfig} */

// Redirect map from the old WordPress URLs to the new site. Literal 301
// (Moved Permanently) redirects, applied at go-live when the domain cuts over.
//
// Sources are written WITHOUT a trailing slash. Next.js (trailingSlash: false)
// strips the trailing slash from an incoming "/foo/" to "/foo" *before* custom
// redirects run, so a trailing-slash source would never match. An old
// "/foo/" URL therefore resolves in two hops: Next 308s "/foo/" → "/foo", then
// the rule below 301s "/foo" → the new URL. "/foo" (no slash) hits the 301
// directly. "/insights/" is intentionally omitted — a source of "/insights"
// would redirect to itself; Next already normalizes "/insights/" → "/insights".
const redirectMap = [
  // Blog posts → /insights/{slug}
  ['/the-sitecore-xp-path-forward-part-3-upgrade-migrate-modernize', '/insights/the-sitecore-xp-path-forward-part-3-upgrade-migrate-modernize'],
  ['/sitecore-xm-cloud-and-jamstack-modern-web-concepts', '/insights/sitecore-xm-cloud-and-jamstack-modern-web-concepts'],
  ['/the-sitecore-xp-path-forward-part-1-overview-of-sitecore-cms-products', '/insights/the-sitecore-xp-path-forward-part-1-overview-of-sitecore-cms-products'],
  ['/cdp-series-part-2-deep-dive-into-cdps-exploring-acquia-optimizely-and-sitecore-solutions', '/insights/cdp-series-part-2-deep-dive-into-cdps-exploring-acquia-optimizely-and-sitecore-solutions'],
  ['/cdp-series-part-1-demystifying-cdps-an-overview-of-types-benefits-and-key-vendors', '/insights/cdp-series-part-1-demystifying-cdps-an-overview-of-types-benefits-and-key-vendors'],
  ['/intersection-of-cmps-and-dxps-and-a-look-into-optimizelys-cmp-solution', '/insights/intersection-of-cmps-and-dxps-and-a-look-into-optimizelys-cmp-solution'],
  ['/adobe-summit-2024-opening-keynote-highlights', '/insights/adobe-summit-2024-opening-keynote-highlights'],
  ['/the-role-of-a-martech-gap-analysis-in-optimizing-your-digital-landscape', '/insights/the-role-of-a-martech-gap-analysis-in-optimizing-your-digital-landscape'],
  ['/selecting-the-right-technology', '/insights/selecting-the-right-technology'],
  ['/navigating-the-digital-terrain', '/insights/navigating-the-digital-terrain'],

  // Services → /services/dxp-advisory
  ['/service/martech-gap-analysis', '/services/dxp-advisory'],
  ['/service/martech-evaluation', '/services/dxp-advisory'],
  ['/service/platform-requirements-alignment', '/services/dxp-advisory'],
  ['/service/digital-platforms-requirements-gathering', '/services/dxp-advisory'],
  ['/service/platform-assessment-recommendation', '/services/dxp-advisory'],
  ['/service/digital-platform-assessment-recommendation', '/services/dxp-advisory'],
  ['/service/enterprise-solution-architecture-design', '/services/dxp-advisory'],
  ['/service/advisory-and-ongoing-support', '/services/dxp-advisory'],
  ['/service/consulting-ongoing-support', '/services/dxp-advisory'],
  ['/service/enterprise-dxp-strategy-roadmapping', '/services/dxp-advisory'],
  ['/service/dxp-functional-roadmap-design', '/services/dxp-advisory'],
  ['/service/business-readiness-assessment', '/services/dxp-advisory'],
  ['/service/sap-commerce-cloud-assessment-optimization', '/services/dxp-advisory'],
  ['/services-overview', '/services/dxp-advisory'],
  ['/services', '/services/dxp-advisory'],
  ['/service', '/services/dxp-advisory'],
  ['/enterprise-services', '/services/dxp-advisory'],

  // Services → /services/hubspot-salesforce
  ['/service/hubspot-sales-hub-setup-sales-enablement', '/services/hubspot-salesforce'],
  ['/service/hubspot-marketing-activation', '/services/hubspot-salesforce'],
  ['/small-business-services', '/services/hubspot-salesforce'],

  // → /framework/digital-blueprint-design
  ['/services/digital-blueprint-design', '/framework/digital-blueprint-design'],
  ['/services/benefits', '/framework/digital-blueprint-design'],

  // → / (homepage)
  ['/service/website-portal-development', '/'],
  ['/service/fractional-cio-support', '/'],

  // Pages
  ['/company-overview', '/about'],
  ['/company-overview/our-approach', '/about'],
  ['/company-overview/our-expertise', '/about'],
  ['/company-overview/why-choose-us', '/about'],
  ['/company-overview/leadership', '/about'],
  ['/insights-hub', '/insights'],
  ['/contact-us', '/contact'],
  ['/book-consultation', '/book'],
  ['/privacy-policy', '/privacy'],
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
      statusCode: 301, // literal 301 Moved Permanently
    }));
  },
};

module.exports = nextConfig;
