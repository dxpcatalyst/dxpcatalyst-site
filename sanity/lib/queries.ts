import { groq } from 'next-sanity';

const seoFields = `seo { metaTitle, metaDescription }`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName, logoLight, logoDark, phone, email, linkedInUrl,
    navCtaLabel, navCtaUrl, footerTagline
  }
`;

const testimonialProjection = `{ _id, quote, attribution, tag }`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    heroHeadline, heroSubheadline, heroCtaLabel, heroCtaUrl,
    positioningText, howWeWorkText, showInsightsPreview,
    newsletterStripHeadline, newsletterSignupUrl,
    ctaBannerText, ctaBannerCtaLabel,
    "testimonials": testimonials[]->${testimonialProjection},
    ${seoFields}
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    headline, introText, approachHeadline, approachText, differentiators,
    "leadershipTeam": leadershipTeam[]->{ _id, name, title, bio, headshot, linkedInUrl },
    ${seoFields}
  }
`;

export const servicePageSlugsQuery = groq`
  *[_type == "servicePage" && defined(slug.current)]{ "slug": slug.current }
`;

export const servicePageBySlugQuery = groq`
  *[_type == "servicePage" && slug.current == $slug][0]{
    title, "slug": slug.current, heroText, progressionText, progressionPhases,
    twoTrackCallout, engagementModelText, whoThisIsForText, representativeWork,
    "testimonials": testimonials[]->${testimonialProjection},
    ctaLabel, ${seoFields}
  }
`;

export const insightsPageQuery = groq`
  *[_type == "insightsPage"][0]{
    headline, introText, beehiivSubdomainUrl, newsletterSignupUrl, showSanityPosts,
    ${seoFields}
  }
`;

export const insightPostsQuery = groq`
  *[_type == "insightPost" && defined(slug.current)] | order(publishedAt desc){
    _id, title, "slug": slug.current, publishedAt, summary, tags,
    "author": author->name, featuredImage
  }
`;

export const insightPostSlugsQuery = groq`
  *[_type == "insightPost" && defined(slug.current)]{ "slug": slug.current }
`;

export const insightPostBySlugQuery = groq`
  *[_type == "insightPost" && slug.current == $slug][0]{
    title, "slug": slug.current, publishedAt, summary, body, tags, featuredImage,
    "author": author->{ name, title, headshot, linkedInUrl },
    ${seoFields}
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    headline, introText, email, phone, address,
    "meetingUrl": *[_type == "bookingPage"][0].hubspotMeetingUrl,
    ${seoFields}
  }
`;

export const bookingPageQuery = groq`
  *[_type == "bookingPage"][0]{
    headline, introText, hubspotMeetingUrl, ${seoFields}
  }
`;

export const workPageQuery = groq`
  *[_type == "workPage"][0]{ headline, introText, ${seoFields} }
`;

export const caseStudiesQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc){
    _id, title, "slug": slug.current, clientName, clientType, industry,
    isAnonymized, publishedAt,
    "relatedOfferingTitle": relatedOffering->title,
    "relatedOfferingSlug": relatedOffering->slug.current
  }
`;

export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }
`;

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    title, "slug": slug.current, clientName, clientType, industry,
    challenge, whatWeDid, outcome, isAnonymized,
    "relatedOfferingTitle": relatedOffering->title,
    "relatedOfferingSlug": relatedOffering->slug.current,
    ${seoFields}
  }
`;

export const legalPageQuery = groq`
  *[_type == "legalPage"][0]{ title, body, lastUpdated, ${seoFields} }
`;
