import type { SchemaTypeDefinition } from 'sanity';

// Reusable objects
import { blockContent } from './objects/blockContent';
import { seo } from './objects/seo';

// Singleton documents
import { siteSettings } from './documents/siteSettings';
import { homePage } from './documents/homePage';
import { aboutPage } from './documents/aboutPage';
import { insightsPage } from './documents/insightsPage';
import { workPage } from './documents/workPage';
import { contactPage } from './documents/contactPage';
import { bookingPage } from './documents/bookingPage';
import { legalPage } from './documents/legalPage';

// Multi documents
import { servicePage } from './documents/servicePage';
import { teamMember } from './documents/teamMember';
import { testimonial } from './documents/testimonial';
import { insightPost } from './documents/insightPost';
import { caseStudy } from './documents/caseStudy';

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  blockContent,
  seo,
  // singletons
  siteSettings,
  homePage,
  aboutPage,
  insightsPage,
  workPage,
  contactPage,
  bookingPage,
  legalPage,
  // multi
  servicePage,
  teamMember,
  testimonial,
  insightPost,
  caseStudy,
];

// Document type names that are singletons — one document, never created/deleted
// through the default document list (see sanity/structure.ts).
export const singletonTypes = new Set<string>([
  'siteSettings',
  'homePage',
  'aboutPage',
  'insightsPage',
  'workPage',
  'contactPage',
  'bookingPage',
  'legalPage',
]);
