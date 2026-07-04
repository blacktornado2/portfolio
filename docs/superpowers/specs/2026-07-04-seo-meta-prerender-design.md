# SEO & Crawler Visibility — Design

**Date:** 2026-07-04
**Problem:** The site is a fully client-rendered SPA. Crawlers, link unfurlers
(LinkedIn/Twitter/WhatsApp), and non-JS fetch tools received only a bare
`<title>` — no description, no preview card, no content.

## Approaches considered

1. **Static meta + baked-in HTML snapshot (chosen).** Full OG/Twitter/JSON-LD
   meta in `index.html`, plus a semantic static snapshot of the landing
   content inside `#root` that React replaces on mount. Zero new
   dependencies, zero build fragility.
2. **Build-time prerender (react-snap / vite prerender plugins).** Rejected:
   puppeteer-based prerender is brittle with framer-motion, canvas, Prism,
   and `localStorage` reads in `ThemeContext` initializers, and slows/flakes
   Vercel builds.
3. **SSR migration (Next.js / vike).** Rejected: a framework rewrite is out
   of proportion to the problem.

## What was implemented

- **`client/index.html`** — primary meta (title, description, canonical,
  theme-color), Open Graph, Twitter card (`summary_large_image`), JSON-LD
  (`Person` + `WebSite`), and a styled static snapshot inside `#root`
  (name, roles, bio, experience, projects, skills, contact links).
  ⚠️ The snapshot copy must be kept in sync manually when Hero, Experience,
  or Projects change.
- **`client/public/og-image.png`** — 1200×630 card derived from
  `portfolio-hero.png` (padded to 1.91:1, resized via `sips`).
- **`client/public/logo.png`** — favicon moved to public so it resolves in
  production builds.
- **`client/public/robots.txt`** — allow all, disallow `/admin`, sitemap ref.
- **`client/public/sitemap.xml`** — static routes (blog posts are reached by
  crawl from `/blog`; a dynamic sitemap endpoint is a possible follow-up).
- **`client/src/lib/seo.js`** — dependency-free `useSeo` hook that updates
  title/description/canonical/OG/Twitter tags per route. Wired into:
  PortfolioHome, BlogIndex, BlogPost (dynamic, from post `title`/`summary`),
  GamesIndex, DrawPage, PricingPage. Games keep their existing
  `document.title` handling.

## Known limitations / follow-ups

- Blog post link previews still show the site-wide card: unfurlers don't run
  JS, and per-post OG tags are set client-side. Fix would be a bot-targeted
  `vercel.json` rewrite (user-agent header match) to a NestJS endpoint that
  returns OG HTML per slug — deferred because Render free-tier cold starts
  (~30s) exceed unfurler timeouts anyway.
- Dynamic sitemap for blog posts (server endpoint or build-time generation).
