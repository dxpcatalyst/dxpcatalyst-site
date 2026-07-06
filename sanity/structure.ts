import type { StructureResolver } from 'sanity/structure';

// Custom Studio desk: singletons are surfaced as single edit views (no list),
// multi-document types keep the standard list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- Singletons ---
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Homepage')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Insights Page')
        .id('insightsPage')
        .child(S.document().schemaType('insightsPage').documentId('insightsPage')),
      S.listItem()
        .title('Work Index Page')
        .id('workPage')
        .child(S.document().schemaType('workPage').documentId('workPage')),
      S.listItem()
        .title('Contact Page')
        .id('contactPage')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.listItem()
        .title('Book a Consultation Page')
        .id('bookingPage')
        .child(S.document().schemaType('bookingPage').documentId('bookingPage')),
      S.listItem()
        .title('Privacy Policy')
        .id('legalPage')
        .child(S.document().schemaType('legalPage').documentId('legalPage')),
      S.divider(),
      // --- Multi-document collections ---
      S.documentTypeListItem('servicePage').title('Service Pages'),
      S.documentTypeListItem('frameworkPage').title('Framework Pages'),
      S.documentTypeListItem('caseStudy').title('Case Studies'),
      S.documentTypeListItem('insightPost').title('Insight Posts'),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ]);
