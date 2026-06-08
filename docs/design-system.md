# Portfolio Design System

> **Purpose:** Single source of truth for extending the "Dark Refined" design language used across Ankit Bhardwaj's portfolio. Hand this file to Claude or any design tool when adding new pages, sections, or components.

---

## 1. Color Palette

### Core

| Token | Hex | Usage |
|---|---|---|
| `bg-base` | `#111111` | Page background, code windows, skill pill bg |
| `bg-surface` | `#1A1A1A` | Cards, nav drawer, form container, code pane, window chrome |
| `bg-surface-dim` | `#161616` | Window title bar (subtler than surface) |
| `border` | `#2A2A2A` | All borders — cards, inputs, nav, dividers |
| `text-primary` | `#FFFFFF` | Headings, card titles, active nav links |
| `text-secondary` | `#888888` | Body copy, subtitles, nav links (default), labels, descriptions |
| `text-dim` | `#555555` | Placeholder text, very quiet labels (uppercase tracking) |
| `text-faint` | `#444444` | Code comments |
| `accent-gold` | `#E8B84B` | Section number prefix, CTA buttons, card left border, icons, focus ring, hover states |
| `accent-gold-hover` | `#D4A83E` | Gold button hover (–10% lightness) |
| `accent-gold-dim` | `rgba(232,184,75,0.35)` | Card hover glow |
| `accent-gold-ring` | `rgba(232,184,75,0.45)` | Custom cursor ring |
| `accent-green` | `#22C55E` | "Available for work" pulse dot |
| `accent-red` | `#EF4444` | macOS close button, validation errors |
| `accent-amber` | `#F59E0B` | macOS minimise button |
| `accent-blue-glow` | `rgba(0,98,255,0.2)` | Hover box-shadow primary (photo, form, code window) |
| `accent-teal-glow` | `rgba(0,255,251,0.15)` | Hover box-shadow secondary |

### Semantic aliases (use these in new components)

```
background  →  #111111
surface     →  #1A1A1A
border      →  #2A2A2A
text        →  #FFFFFF
muted       →  #888888
accent      →  #E8B84B
```

---

## 2. Typography

### Font Families

| Role | Family | Tailwind class | Google Fonts weights |
|---|---|---|---|
| Display / Headings / Buttons | Syne | `font-syne` | 400, 600, 700, 800 |
| Body / UI text | DM Sans | `font-sans` (default) | 400, 500, italic |
| Code / Monospace | JetBrains Mono | `font-mono` | 400, 500 |

### Scale

| Usage | Classes |
|---|---|
| Hero h1 | `font-syne font-bold text-5xl lg:text-7xl leading-tight` |
| Section heading (h2) | `font-syne font-bold text-4xl lg:text-5xl` |
| Card heading (h3) | `font-syne font-bold text-xl` |
| Sub-heading (h3 large) | `font-syne font-bold text-3xl` |
| Body large | `text-lg leading-relaxed` |
| Body default | `text-sm leading-relaxed` (most card copy) |
| Label / meta | `text-xs uppercase tracking-widest text-[#555555]` |
| Skill pill / badge | `text-sm` |
| Code | `font-mono text-sm` (14px) / `!text-[15px]` in Prism block |
| Nav link | `text-sm font-medium` |
| Button primary | `font-syne font-bold text-sm` |

### Section heading pattern

```
<span class="text-[#E8B84B]">01</span> — About Me
<span class="text-[#E8B84B]">02</span> — Skills
<span class="text-[#E8B84B]">03</span> — Professional Journey
<span class="text-[#E8B84B]">04</span> — Projects
<span class="text-[#E8B84B]">05</span> — Contact
```

New sections follow: `06`, `07`, etc.

---

## 3. Spacing & Layout

### Page

- Max content width: `max-w-7xl` (1280px)
- Horizontal padding: `px-6 lg:px-12`
- Section vertical padding: `py-24`
- Section header bottom margin: `mb-16`

### Grid columns

| Pattern | Classes |
|---|---|
| Two-column content | `grid grid-cols-1 lg:grid-cols-2 gap-16` |
| Two-column cards | `grid grid-cols-1 md:grid-cols-2 gap-6` |
| Three-column cards | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |

### Border radius

- Cards / containers: `rounded-xl`
- Buttons (primary): `rounded-lg`
- Buttons (compact): `rounded-md`
- Badges / pills / inputs: `rounded-md` or `rounded-lg`
- Skill pills: `rounded-md`
- Status badge: `rounded-full`
- Icon containers: `rounded-lg`

---

## 4. Component Patterns

### 4.1 Content Card

The universal card recipe. Use for experience, education, skills, projects, any list item.

```
bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6
style={{ borderLeft: "3px solid #E8B84B" }}    ← gold accent — must be inline style
whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(232,184,75,0.35)" }}
```

- Inner divider: `border-t border-[#2A2A2A] pt-4`
- Card heading: `font-syne font-bold text-white text-xl`
- Card body: `text-[#888888] text-sm leading-relaxed`

### 4.2 Primary Button (CTA)

```
font-syne font-bold bg-[#E8B84B] text-[#111111] px-6 py-3 rounded-lg
hover:bg-[#D4A83E] transition-colors
```

Compact nav variant: `px-4 py-2 rounded-md text-sm`

### 4.3 Ghost / Text Link

```
text-[#888888] hover:text-[#E8B84B] transition-colors
```

### 4.4 Skill / Tag Pill

```
flex items-center gap-1.5 bg-[#111111] border border-[#2A2A2A]
text-[#888888] rounded-md px-3 py-1.5 text-sm
```

Hover (spring animation):
```js
whileHover={{ scale: 1.1, boxShadow: "0 0 14px rgba(232,184,75,0.45)", borderColor: "rgba(232,184,75,0.5)" }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```

Shimmer overlay inside pill:
```
<span aria-hidden class="absolute inset-0 -translate-x-full group-hover:translate-x-full
  transition-transform duration-500 ease-in-out
  bg-gradient-to-r from-transparent via-white/10 to-transparent" />
```

### 4.5 Tech / Readonly Tag (no hover)

```
bg-[#111111] border border-[#2A2A2A] text-[#888888] rounded-md px-3 py-1 text-xs
```

### 4.6 Status / Period Badge

```
text-xs text-[#888888] bg-[#111111] border border-[#2A2A2A] px-3 py-1 rounded-md whitespace-nowrap
```

### 4.7 Icon Container (contact info row)

```
bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg flex-shrink-0
<Icon class="w-5 h-5 text-[#E8B84B]" aria-hidden="true" />
```

### 4.8 Availability Badge

```
badge-shine inline-flex items-center gap-2 px-4 py-1.5 rounded-full
bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#888888]
```

Pulse dot inside: `w-2 h-2 rounded-full bg-[#22C55E] animate-pulse`

### 4.9 Code Window (macOS chrome)

```
bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden

  Title bar:  bg-[#161616] px-5 py-4 border-b border-[#2A2A2A]
  Traffic lights: w-3 h-3 rounded-full  bg-[#EF4444] / [#F59E0B] / [#22C55E]
  Filename label: text-xs text-[#888888] font-mono ml-3

  Code area: pre.language-javascript  !m-0 !p-5 !text-[15px]
```

Prism syntax colours (applied via CSS classes in index.css):
- keywords / numbers / booleans: `#E8B84B`
- strings: `#D4C090`
- properties / operators: `#888888`
- punctuation / functions: `#FFFFFF`
- comments: `#444444` italic

### 4.10 Form Input

```
w-full bg-[#111111] border rounded-lg px-4 py-3 text-white placeholder-[#555555]
focus:outline-none transition-colors

default:   border-[#2A2A2A] focus:border-[#E8B84B]
error:     border-red-500 focus:border-red-400
```

Error message: `text-red-400 text-xs mt-1`
Submit button: same as Primary Button + `disabled:opacity-60 disabled:cursor-not-allowed`
Success feedback: `text-green-400 text-sm text-center`

### 4.11 Navigation Header

```
fixed top-0 left-0 w-full z-50 transition-all duration-300
scrolled:     bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]
transparent:  bg-transparent
```

Logo: `font-syne font-bold text-white text-lg hover:text-[#E8B84B] transition-colors`

Search button (inline):
```
flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-1.5
font-mono text-[11px] text-[#888888]
hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors duration-150
```

Mobile drawer: `bg-[#1A1A1A] border-t border-[#2A2A2A] px-6 py-6 flex flex-col gap-5`

### 4.12 Blog Post Card (grid layout)

```
bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6
group-hover:border-[#E8B84B] group-hover:-translate-y-0.5 transition-all duration-200
```

- Tag badge: `font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B]`
- Title: `font-syne font-bold text-base text-white group-hover:text-[#E8B84B] transition-colors`
- Summary: `text-sm text-[#888888] leading-relaxed`
- Footer meta: `font-mono text-[11px] text-[#555555]` — date left, read time right
- Footer divider: `border-t border-[#2A2A2A] pt-3 mt-auto`

### 4.13 Blog Post Row (list layout)

```
py-7 border-b border-[#2A2A2A] grid grid-cols-[1fr_auto] gap-5 items-start
group-hover:pl-1.5 transition-all duration-150
```

- Featured title: `font-syne font-bold text-[22px]`
- Default title: `font-syne font-bold text-[18px]`
- Meta (date + read time): `font-mono text-xs text-[#555555]` right-aligned

### 4.14 Blog Tag Filter Button

```
font-mono text-[11px] uppercase tracking-[0.06em] px-3 py-1 rounded border transition-all duration-150

active:   border-[#E8B84B] bg-[#E8B84B]/10 text-[#E8B84B]
inactive: border-[#2A2A2A] text-[#888888] hover:border-[#E8B84B] hover:text-[#E8B84B]
```

### 4.15 Blog Search Bar

```
bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2
font-sans text-sm text-white placeholder-[#555555]
focus:border-[#E8B84B] transition-colors duration-200
```

Search icon: `absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]` 14×14px

### 4.16 Blog Empty State

```
flex flex-col items-center justify-center py-24 text-center
```

- Icon: 40×40px search SVG, `text-[#2A2A2A]`, `mb-5`
- Headline: `font-syne font-bold text-lg text-white mb-2`
- Message: `font-sans text-sm text-[#555555] mb-6 max-w-xs` — context-aware (search vs tag)
- Clear button: ghost style — `font-mono text-[11px] uppercase px-4 py-2 border border-[#2A2A2A] text-[#888888] hover:border-[#E8B84B] hover:text-[#E8B84B]`

---

## 5. Animation & Motion

All Framer Motion variants are declared at **module scope** (not inline) in `SCREAMING_SNAKE_CASE`.

### 5.1 Section header entrance (fires on scroll, once)

```js
const HEADER_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};
```

### 5.2 Staggered card list

```js
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};
// Usage per card: custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}
```

Delay step is `0.1s` per card (`0.15s` for project cards with images).

### 5.3 Hero stagger (on mount, not scroll)

```js
const FADE_UP = [0.1, 0.2, 0.3, 0.4, 0.5].map((delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
}));
// Usage: {...FADE_UP[0]}, {...FADE_UP[1]}, …
```

### 5.4 Slide-in from side (right panel / photo)

```js
{ initial: { opacity: 0, x: 40 }, animate/whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 } }
{ initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, ... }
```

### 5.5 Hover states

| Element | whileHover |
|---|---|
| Content card | `{ scale: 1.03, boxShadow: "0 0 24px rgba(232,184,75,0.35)" }` |
| Large image / form / code window | `{ scale: 1.04, boxShadow: "0 0 40px rgba(0,98,255,0.2), 0 0 80px rgba(0,255,251,0.1)" }` |
| Photo (profile) | `{ scale: 1.05, boxShadow: "0 0 40px rgba(0,98,255,0.2), 0 0 80px rgba(0,255,251,0.15)" }` |
| Skill pill | `{ scale: 1.1, boxShadow: "0 0 14px rgba(232,184,75,0.45)", borderColor: "rgba(232,184,75,0.5)" }` |
| Availability badge | `{ boxShadow: "0 0 40px rgba(0,98,255,0.2), 0 0 80px rgba(0,255,251,0.15)" }` |

Hover transition: `{ duration: 0.3 }` (default), `{ type: "spring", stiffness: 400, damping: 25 }` for pills.

### 5.6 Custom cursor

- `.cursor-dot` — 8×8px gold filled circle, `z-index: 9999`
- `.cursor-ring` — 32×32px ring `border: 1.5px solid rgba(232,184,75,0.45)`, transitions to 48×48px on hover
- Driven by `GoldenCursor.jsx` (RAF-based, only active on `body.golden-cursor-active`)

### 5.7 Badge shine (shimmer sweep)

`.badge-shine::after` — `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)` sweeps on hover over 0.5s.

### 5.8 Meteor animation (Tailwind keyframe)

```css
@keyframes meteor {
  0%   { transform: rotate(215deg) translateX(0); opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
}
/* duration: 5s linear infinite */
```

---

## 6. Accessibility Conventions

- Every section: `<section aria-labelledby="[id]-heading">` + `<h2 id="[id]-heading">`
- All decorative icons: `aria-hidden="true"`
- Form inputs: `aria-label` on every `<input>` and `<textarea>`
- Mobile menu button: `aria-label="Toggle menu"` + `aria-expanded={bool}`
- Keyboard: Escape closes mobile menu; `⌘K` / `Ctrl+K` opens command palette

---

## 7. Iconography

| Library | Usage |
|---|---|
| `lucide-react` | UI icons (Menu, X, Send, Mail, MapPin, ExternalLink, Code2, Database, Cloud, Cpu) |
| `react-icons/fa` | Brand icons (FaReact, FaNodeJs, FaGitAlt, FaGithub, FaLinkedin, FaLinux, FaGitlab) |
| `react-icons/si` | Tech stack icons (SiNextdotjs, SiTypescript, SiTailwindcss, etc.) |
| `react-icons/tb` | Tool icons (TbBrandVscode) |
| `react-icons/bs` | Misc (BsFileEarmarkCode, BsGrid1X2) |
| `react-icons/fc` | Full-colour icons (FcWorkflow) |

Icon sizes: `w-6 h-6` (card category header), `w-5 h-5` (contact info rows), `w-4 h-4` (pills, link icons).
Icon colour in cards/containers: `text-[#E8B84B]`.
Icon colour in pills: tech-specific (e.g. `text-[#61DAFB]` for React).

---

## 8. Image Conventions

- Profile photo: `rounded-2xl ring-2 ring-[#E8B84B] ring-offset-4 ring-offset-[#111111]`
- Project preview thumbnail: `h-44 overflow-hidden border-b border-[#2A2A2A]` container, `object-cover object-top` image
- Alt text always descriptive; decorative images use `aria-hidden`

---

## 9. Page / Route Structure

```
/ (SPA)
  #home       → Hero + code window
  #skills     → icon cloud + 2×2 skill cards        (02 — Skills)
  #experience → experience cards                     (03 — Professional Journey)
  #projects   → 2-col project cards                  (04 — Projects)
  #contact    → info panel + form                    (05 — Contact)

  About Me (01) lives inside Hero.jsx → renders PortfolioPage.jsx internally
  No top-level #about or #education anchor

/blog             → BlogIndex — search, tag filters, grid/list toggle
/blog/:slug       → BlogPost — full post, comments, likes
/games            → GamesIndex
/games/2048       → Game2048
/games/wordle     → GameWordle
/games/typeracer  → GameTyperacer
/draw             → DrawPage — canvas drawing tool
```

Sections use `border-t border-[#2A2A2A]` between them for visual separation (About section).

---

## 10. Backend Stack

| Layer | Technology | Notes |
|---|---|---|
| API server | NestJS 10 (Node.js) | Modules: posts, comments, likes, auth |
| ORM | Prisma 6 | Schema at `server/prisma/schema.prisma` |
| Database | PostgreSQL (Neon) | Serverless, free tier, `?sslmode=require` required |
| Auth | JWT + Passport | Single admin user; credentials in Render env vars |
| Hosting | Render (free tier) | Docker-based deploy, cold starts after 15min idle |
| API base URL | `https://portfolio-ndcb.onrender.com` | Set via `VITE_API_URL` in Vercel env vars |

### API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/posts` | — | Paginated posts, optional `?tag=` filter |
| `GET` | `/posts/:slug` | — | Single post |
| `POST` | `/posts` | JWT | Create post |
| `PUT` | `/posts/:slug` | JWT | Update post |
| `DELETE` | `/posts/:slug` | JWT | Delete post |
| `GET` | `/posts/:slug/comments` | — | Comments for a post |
| `POST` | `/posts/:slug/comments` | — | Add comment |
| `DELETE` | `/comments/:id` | JWT | Delete comment |
| `GET` | `/posts/:slug/likes` | — | Like count + liked status |
| `POST` | `/posts/:slug/likes` | — | Toggle like (IP-hash based) |
| `POST` | `/auth/login` | — | Returns `accessToken` JWT |

### Client API layer

All API calls go through `client/src/lib/api.ts`. It reads `VITE_API_URL` (falls back to `http://localhost:3001`) and injects the JWT from `localStorage` automatically on authenticated requests.

---

## 11. Extending the System — Rules for New Sections / Pages

1. **Background is always `#111111`.** Never use white or light backgrounds.
2. **Section heading follows the numbered pattern** (`06 — <Name>`). Number in gold, em-dash, name in white.
3. **Section vertical padding is `py-24`.** Don't reduce to less than `py-16`.
4. **Cards use the three-part recipe** (surface bg + border + gold left-border inline style). Don't invent new card styles.
5. **All animations at module scope.** No inline Framer Motion objects.
6. **Hover glows use one of two palettes:** gold (`rgba(232,184,75,...)`) for content, blue-teal (`rgba(0,98,255,...)` + `rgba(0,255,251,...)`) for featured/hero elements.
7. **New pages inherit the Header and GoldenCursor** components from the portfolio shell.
8. **Font for any heading or button: `font-syne font-bold`.** Body text defaults to DM Sans (`font-sans`). Code always `font-mono`.
9. **Muted label pattern:** `text-xs uppercase tracking-widest text-[#555555]`
10. **Dividers inside cards:** `border-t border-[#2A2A2A]` — never a full horizontal rule (`<hr>`).
11. **Blog tag filters never change when a tag is active** — `allTags` is derived from the unfiltered response only.
12. **Empty states follow pattern 4.16** — icon, headline, context-aware message, clear-filters button.
