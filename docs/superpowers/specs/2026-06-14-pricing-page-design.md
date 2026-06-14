# Pricing Page — Design Spec

**Date:** 2026-06-14
**Route:** `/pricing`
**Access:** URL-only — no link from the main portfolio nav or any other page

---

## 1. Purpose

A standalone freelancing pricing page for recruiters/clients who already have the URL. Keeps the main portfolio clean while giving serious leads a clear picture of scope and cost.

---

## 2. Route & Access

- New React Router route: `/pricing`
- **Not linked** from the main portfolio (`/`), blog, games, or any other page
- No entry in the Header navbar
- Shares the same Vite + React 18 + Tailwind + Framer Motion setup as the rest of the client

---

## 3. Page Structure (top to bottom)

### 3.1 Minimal Navbar

A slim top bar — not the full portfolio `<Header>` component.

| Element | Detail |
|---|---|
| Left | Logo monogram `AB` in `font-syne font-bold text-[var(--accent)]` |
| Right | `← Back to portfolio` link → navigates to `/` |
| Background | `var(--bg-deep)` with `border-b border-[var(--border)]` |

### 3.2 Hero Section

Short, punchy — no full-screen height.

| Element | Detail |
|---|---|
| Badge | "Available for work" pill — `var(--accent)` border + text, green pulse dot |
| Heading | `Let's build something worth shipping.` — `font-syne font-bold text-4xl`, accent on last word |
| Subtext | One sentence positioning statement (transparent pricing, no retainer lock-in) |
| Bottom border | `border-b border-[var(--border)]` separating from pricing rows |

### 3.3 Pricing Rows (core section)

Three horizontal rows stacked vertically. Each row: icon box on the left, title + description + tech pills in the middle, price right-aligned.

#### Row 1 — Landing Page

| Field | Value |
|---|---|
| Icon | monitor / browser icon |
| Title | `Landing Page` |
| Price | `$500` (fixed, not "starting at") |
| Description | Static site — no backend, no database. React + Tailwind. Mobile-first, fast, accessible. |
| Tech pills | React · Tailwind · Framer Motion · Vite |
| Border | `var(--border)` (default, no highlight) |

#### Row 2 — Full Stack Application *(highlighted)*

| Field | Value |
|---|---|
| Icon | lightning bolt icon |
| Title | `Full Stack Application` |
| Price | `Starting $1,500` (placeholder — to be updated) |
| Description | End-to-end web apps with REST API, database, auth, and deployment. |
| Tech pills | NestJS · Prisma · PostgreSQL · JWT Auth |
| Badge | `Most Popular` tab in gold at top-right of the row |
| Border | `var(--accent)` at 33% opacity |

#### Row 3 — Custom / Ongoing

| Field | Value |
|---|---|
| Icon | chat / speech bubble icon |
| Title | `Custom / Ongoing` |
| Price | `Let's Talk` (muted, `var(--text-3)`) |
| Description | Complex architectures, long-term contracts, consulting, code audits — anything that doesn't fit a box. |
| Tech pills | None |
| Border | Dashed `var(--border)` — visually distinct from the above two |
| Background | Slightly darker (`var(--bg-deep)`) to further separate it |

### 3.4 Bottom CTA Banner

Full-width section anchored at the bottom of the page.

| Element | Detail |
|---|---|
| Background | `var(--bg-deep)` with `border-t` in gold at 20% opacity |
| Eyebrow | `READY TO START?` — `var(--text-4)` uppercase tracking-widest |
| Heading | `Have a project in mind?` — `font-syne font-bold` |
| Subtext | `I typically respond within 24 hours.` |
| CTA Button | `Get in Touch →` — gold filled button, links to `mailto:blacktornado2108@gmail.com` |

---

## 4. Design Tokens

Follows the "Dark Refined" design system exactly. All values from CSS vars — no hardcoded hex except the button text (`#111111` per design system convention).

| Token | Usage |
|---|---|
| `var(--bg)` | Page background |
| `var(--bg-deep)` | Navbar, CTA banner, Custom row background |
| `var(--surface)` | Pricing row cards |
| `var(--border)` | Row borders, navbar border |
| `var(--text-1)` | Row titles, headings |
| `var(--text-2)` | Descriptions |
| `var(--text-3)` | Tech pills, "Let's Talk" price |
| `var(--accent)` | Logo, badge, highlighted row border, prices, CTA button |

Supports both dark (default) and light mode via the existing `data-mode` system. ThemeSwitcher (accent colour) works automatically since everything uses CSS vars.

---

## 5. Animation

- Entry animations via Framer Motion using `HEADER_ANIM` pattern from `client/src/lib/animations.js`
- Each pricing row fades + slides up with a staggered delay (0.1s apart)
- No scroll-triggered parallax — keep it light

---

## 6. Component Structure

```
client/src/pricing/
  PricingPage.jsx       ← page root, registered in App.jsx as /pricing
  PricingNav.jsx        ← slim navbar (logo + back link)
  PricingHero.jsx       ← badge + heading + subtext
  PricingRow.jsx        ← reusable row component (icon, title, desc, pills, price)
  PricingCTA.jsx        ← bottom CTA banner
```

Data for the rows lives as a const array inside `PricingPage.jsx` — no separate data file needed at this scale.

---

## 7. Router Integration

Add one route to `client/src/App.jsx`:

```jsx
import PricingPage from "./pricing/PricingPage";
// ...
<Route path="/pricing" element={<PricingPage />} />
```

No changes to the Header navbar, no anchor links added anywhere.

The global `<Footer>` component is **not** rendered on `/pricing`. The CTA banner (section 3.4) is the terminal section of the page. Check `App.jsx` to confirm Footer is only conditionally rendered on the routes that currently include it (`/`, `/blog`, `/blog/:slug`, `/games`).

---

## 8. Out of Scope

- No FAQ section (can be added later)
- No contact form (CTA links directly to email)
- No analytics or tracking specific to this page
- No server-side changes
- Prices are placeholder values — update the const array before going live
