# DXP Catalyst Website

Next.js 14 (App Router) + Sanity CMS. Rebuild of dxpcatalyst.com per the planning
docs in [`docs/`](./docs).

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **CMS:** Sanity v3 — Studio embedded at [`/studio`](http://localhost:3000/studio)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel Pro (Vercel Analytics enabled)
- **Integrations:** HubSpot (tracking, contact form, meetings), ai12z widget,
  Beehiiv newsletter feed

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in values
npm run dev                        # site at :3000, Studio at :3000/studio
```

You'll need a Sanity project: create one at [sanity.io/manage](https://www.sanity.io/manage),
then set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (site + Studio) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |

## Content model

All schemas live in [`sanity/schemaTypes/`](./sanity/schemaTypes). Singletons are
surfaced as single edit views via [`sanity/structure.ts`](./sanity/structure.ts).

| Type | Kind | Route |
| --- | --- | --- |
| `homePage` | singleton | `/` |
| `aboutPage` | singleton | `/about` |
| `servicePage` | multi | `/services/[slug]` |
| `insightsPage` | singleton | `/insights` |
| `insightPost` | multi | `/insights/[slug]` |
| `workPage` | singleton | `/work` |
| `caseStudy` | multi | `/work/[slug]` |
| `contactPage` | singleton | `/contact` |
| `bookingPage` | singleton | `/book` |
| `legalPage` | singleton | `/privacy` |
| `teamMember` | multi | referenced from About |
| `testimonial` | multi | referenced from Home + service pages |
| `siteSettings` | singleton | global nav/footer/contact |

## Project layout

```
app/
  (site)/            Marketing routes (Header + Footer chrome)
  studio/            Embedded Sanity Studio (/studio, no-index)
  api/revalidate/    Sanity publish webhook → ISR purge + ai12z re-sync
  sitemap.ts, robots.ts
components/           Header, Footer, HubSpot/ai12z embeds, feed + testimonial UI
lib/                 SEO helper, Beehiiv feed parser
sanity/              Client, image, queries, env, schema types, Studio structure
next.config.js       308 redirect map from the old WordPress URLs
```

## Environment variables

See [`.env.local.example`](./.env.local.example). Production values are set in
Vercel — never commit secrets.

## Integrations

- **HubSpot** — tracking script loads globally in the root layout. Contact form
  (`/contact`) and meetings scheduler (`/book`) embed IDs/URLs are editable in
  Sanity; both degrade to plain-text fallbacks if the embed fails.
- **Beehiiv** — the Insights feed parses the public subdomain HTML at build time
  (ISR, hourly) and merges Sanity-authored `insightPost` docs. Falls back to a
  static card if the fetch fails.
- **ai12z** — floating widget loaded globally; content re-syncs when the Sanity
  publish webhook hits `/api/revalidate`.

> Confirm the exact ai12z embed script URL / web-component tag against the live
> connector config — the values in `components/Ai12zWidget.tsx` follow the
> standard embed shape but should be verified at integration time.

## Deployment

Push to `main` → Vercel auto-deploys. The Studio deploys with the app at
`/studio`. Redirects from the old WordPress URLs are in `next.config.js`.
```
