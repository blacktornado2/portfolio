# Portfolio Design System

> **Purpose:** Single source of truth for extending the "Dark Refined" design language used across Ankit Bhardwaj's portfolio. Hand this file to Claude or any design tool when adding new pages, sections, or components.

---

## 1. Color Palette

### CSS Custom Property Token System

All non-admin components use CSS custom properties (set in `client/src/assets/css/index.css`). **Never use raw hex for these values in new code — always use the CSS var.**

| CSS var | Dark value | Light value | Usage |
|---|---|---|---|
| `var(--bg)` | `#111111` | `#F5F5F5` | Page background, code windows, skill pill bg |
| `var(--bg-deep)` | `#0D0D0D` | `#E8E8E8` | Footer background |
| `var(--bg-95)` | `rgba(17,17,17,0.95)` | `rgba(245,245,245,0.95)` | Frosted navbar bg (pre-computed; Tailwind opacity modifier can't use vars) |
| `var(--surface)` | `#1A1A1A` | `#FFFFFF` | Cards, nav drawer, form container, code pane, window chrome |
| `var(--border)` | `#2A2A2A` | `#D8D8D8` | All borders — cards, inputs, nav, dividers |
| `var(--text-1)` | `#FFFFFF` | `#111111` | Headings, card titles, active nav links |
| `var(--text-2)` | `#888888` | `#555555` | Body copy, subtitles, nav links (default), labels, descriptions |
| `var(--text-3)` | `#555555` | `#888888` | Placeholder text, very quiet labels |
| `var(--text-4)` | `#444444` | `#AAAAAA` | Code comments, copyright |

Accent vars (theme-switchable, not mode-switchable). Six themes, selectable via the ThemeSwitcher in the Footer; **Crimson is the default**. Defined in `index.css` (`[data-theme="…"]`) and mirrored in the `THEMES` object in `ThemeContext.jsx` (which also holds the `r0/r35/r45/r50` glow rgba values used by Framer hover effects):

| Theme | `var(--accent)` | `var(--accent-dark)` |
|---|---|---|
| Crimson (default) | `#F43F5E` | `#E11D48` |
| Gold | `#E8B84B` | `#D4A83E` |
| Blue | `#4D9FFF` | `#2563EB` |
| Purple | `#A855F7` | `#9333EA` |
| Green | `#1BB300` | `#159400` |
| Orange | `#FB923C` | `#F97316` |

`var(--accent-05..70)` provide the same accent at each opacity step (rgba). When changing a theme's base colour, recompute these alpha variants **and** the `THEMES` glow values to keep them in sync.

> **Theme-reactive rings/borders:** never paint a static accent ring with Tailwind's `ring` utility on an element that also has a Framer `whileHover` `boxShadow` — both use the `box-shadow` property and Framer freezes the resolved colour inline on hover-exit, breaking theme switching. Use `outline` (e.g. `outline outline-2 outline-offset-4 outline-[color:var(--accent)]`) so the static ring lives on a different property. Also note Tailwind ambiguous arbitrary utilities (`ring`/`outline`/`ring-offset`) need a `color:` hint, e.g. `outline-[color:var(--accent)]`.

### Static hex values (not mode/theme dependent — still hardcoded)

| Hex | Usage |
|---|---|
| `#111111` | Gold button text (`text-[#111111]`) — intentionally hardcoded so button text stays dark in both modes |
| `#161616` | Code window title bar (subtler than surface) |
| `#22C55E` | "Available for work" pulse dot |
| `#EF4444` | macOS close button, validation errors |
| `#F59E0B` | macOS minimise button |
| `#d60039` | Blog "Featured" badge text |
| `rgba(0,98,255,0.2)` | Hover box-shadow primary (photo, form, code window) |
| `rgba(0,255,251,0.15)` | Hover box-shadow secondary |

### Mode switching

The `<html>` element gets `data-mode="dark"` (default) or `data-mode="light"`. `ThemeContext.jsx` manages this and persists to `localStorage("portfolio-mode")`. The `[data-mode="light"]` selector in `index.css` overrides all mode vars.

**Admin panel** (`client/src/admin/`) is excluded — all admin files retain hardcoded hex and stay permanently dark regardless of global mode.

### Semantic aliases (use CSS vars in new components)

```
background  →  var(--bg)
surface     →  var(--surface)
border      →  var(--border)
text        →  var(--text-1)
muted       →  var(--text-2)
accent      →  var(--accent)
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
| Label / meta | `text-xs uppercase tracking-widest text-[var(--text-3)]` |
| Skill pill / badge | `text-sm` |
| Code | `font-mono text-sm` (14px) / `!text-[15px]` in Prism block |
| Nav link | `text-sm font-medium` |
| Button primary | `font-syne font-bold text-sm` |

### Section heading pattern

```
<span class="text-[var(--accent)]">01</span> — About Me
<span class="text-[var(--accent)]">02</span> — Professional Journey
<span class="text-[var(--accent)]">03</span> — Projects
<span class="text-[var(--accent)]">04</span> — Dev Notes
<span class="text-[var(--accent)]">05</span> — Side Quests
<span class="text-[var(--accent)]">06</span> — Skills
<span class="text-[var(--accent)]">07</span> — Testimonials
<span class="text-[var(--accent)]">08</span> — Contact
```

New sections follow: `09`, `10`, etc.

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
bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6
style={{ borderLeft: "3px solid var(--accent)" }}    ← gold accent — must be inline style
whileHover={{ scale: 1.03, boxShadow: theme.r35 }}
```

- Inner divider: `border-t border-[var(--border)] pt-4`
- Card heading: `font-syne font-bold text-[var(--text-1)] text-xl`
- Card body: `text-[var(--text-2)] text-sm leading-relaxed`

### 4.2 Primary Button (CTA)

```
font-syne font-bold bg-[var(--accent)] text-[#111111] px-6 py-3 rounded-lg
hover:bg-[var(--accent-dark)] transition-colors
```

Note: button text is hardcoded `text-[#111111]` (not a CSS var) — intentionally dark in both light and dark mode.

Compact nav variant: `px-4 py-2 rounded-md text-sm`

### 4.3 Ghost / Text Link

```
text-[var(--text-2)] hover:text-[var(--accent)] transition-colors
```

### 4.4 Skill / Tag Pill

```
flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)]
text-[var(--text-2)] rounded-md px-3 py-1.5 text-sm
```

Hover (spring animation):
```js
whileHover={{ scale: 1.1, boxShadow: theme.r45, borderColor: theme.r50 }}
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
bg-[var(--bg)] border border-[var(--border)] text-[var(--text-2)] rounded-md px-3 py-1 text-xs
```

### 4.6 Status / Period Badge

```
text-xs text-[var(--text-2)] bg-[var(--bg)] border border-[var(--border)] px-3 py-1 rounded-md whitespace-nowrap
```

### 4.7 Icon Container (contact info row)

```
bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex-shrink-0
<Icon class="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
```

### 4.8 Availability Badge

```
badge-shine inline-flex items-center gap-2 px-4 py-1.5 rounded-full
bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)]
```

Pulse dot inside: `w-2 h-2 rounded-full bg-[#22C55E] animate-pulse`

### 4.9 Code Window (macOS chrome)

```
bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden

  Title bar:  bg-[#161616] px-5 py-4 border-b border-[var(--border)]
  Traffic lights: w-3 h-3 rounded-full  bg-[#EF4444] / [#F59E0B] / [#22C55E]
  Filename label: text-xs text-[var(--text-2)] font-mono ml-3

  Code area: pre.language-javascript  !m-0 !p-5 !text-[15px]
```

Prism syntax colours (hardcoded in `index.css` — not mode-switchable, code blocks always dark):
- keywords / numbers / booleans: `#E8B84B`
- strings: `#D4C090`
- properties / operators: `#888888`
- punctuation / functions: `#FFFFFF`
- comments: `#444444` italic

### 4.10 Form Input

```
w-full bg-[var(--bg)] border rounded-lg px-4 py-3 text-[var(--text-1)] placeholder-[var(--text-3)]
focus:outline-none transition-colors

default:   border-[var(--border)] focus:border-[var(--accent)]
error:     border-red-500 focus:border-red-400
```

Error message: `text-red-400 text-xs mt-1`
Submit button: same as Primary Button + `disabled:opacity-60 disabled:cursor-not-allowed`
Success feedback: `text-green-400 text-sm text-center`

### 4.11 Navigation Header

```
fixed top-0 left-0 w-full z-50 transition-all duration-300
scrolled:     bg-[var(--bg-95)] backdrop-blur-sm border-b border-[var(--border)]
transparent:  bg-transparent
```

Logo: `font-syne font-bold text-[var(--text-1)] text-lg hover:text-[var(--accent)] transition-colors`

Nav links (shorter labels, in page order):
```
About · Experience · Projects · Blog · Games · Skills · Contact
```

Search button (inline):
```
flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5
font-mono text-[11px] text-[var(--text-2)]
hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150
```

Mobile drawer: `bg-[var(--surface)] border-t border-[var(--border)] px-6 py-6 flex flex-col gap-5`

**Scroll progress bar** — `absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)]` inside the header, driven by Framer Motion `useScroll` + `useSpring`:
```js
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });
// <motion.div style={{ scaleX }} className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left" />
```

**Theme/mode controls are NOT in the header** — they live in the Footer (see 4.19).

### 4.12 Blog Post Card (grid layout)

Card styling and hover glow live on the `motion.div` — **not** on an inner `article` — so box-shadow renders against the rounded, backgrounded element. Glow strings come from `theme.r0` / `theme.r45` (ThemeContext) so they switch colour with the theme:

```jsx
const { theme } = useTheme();
<motion.div
  className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-xl"
  initial={{ boxShadow: `0 0 0px ${theme.r0}` }}
  whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${theme.r45}`, zIndex: 10 }}
  transition={{ duration: 0.2 }}
>
  <Link className="group flex flex-col gap-3 p-6 h-full">…</Link>
</motion.div>
```

- Tag badge: `font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)]`
- Featured badge: `font-mono text-[10px] uppercase tracking-[0.06em] text-[#d60039]` (no border/bg — text only)
- Title: `font-syne font-bold text-base text-[var(--text-1)] group-hover:text-[var(--accent)] transition-colors`
- Summary: `text-sm text-[var(--text-2)] leading-relaxed`
- Footer meta: `font-mono text-[11px] text-[var(--text-3)]` — date left, read time right
- Footer divider: `border-t border-[var(--border)] pt-3 mt-auto`

### 4.13 Blog Post Row (list layout)

```
py-7 border-b border-[var(--border)] grid grid-cols-[1fr_auto] gap-5 items-start
group-hover:pl-1.5 transition-all duration-150
```

- Featured title: `font-syne font-bold text-[22px]`
- Default title: `font-syne font-bold text-[18px]`
- Meta (date + read time): `font-mono text-xs text-[var(--text-3)]` right-aligned

### 4.14 Blog Tag Filter Button

```
font-mono text-[11px] uppercase tracking-[0.06em] px-3 py-1 rounded border transition-all duration-150

active:   border-[var(--accent)] bg-[var(--accent-10)] text-[var(--accent)]
inactive: border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]
```

### 4.15 Blog Search Bar

```
bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2
font-sans text-sm text-[var(--text-1)] placeholder-[var(--text-3)]
focus:border-[var(--accent)] transition-colors duration-200
```

Search icon: `absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]` 14×14px

### 4.16 Blog Empty State

```
flex flex-col items-center justify-center py-24 text-center
```

- Icon: 40×40px search SVG, `text-[var(--border)]`, `mb-5`
- Headline: `font-syne font-bold text-lg text-[var(--text-1)] mb-2`
- Message: `font-sans text-sm text-[var(--text-3)] mb-6 max-w-xs` — context-aware (search vs tag)
- Clear button: ghost style — `font-mono text-[11px] uppercase px-4 py-2 border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]`

### 4.17 Landing Page Preview Cards (FieldNotesSection / SideQuestsSection)

Same gold glow pattern as the blog grid card (4.12). The `motion.div` IS the card:

```jsx
const { theme } = useTheme();
<motion.div
  className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-xl"
  initial={{ boxShadow: `0 0 0px ${theme.r0}` }}
  whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${theme.r45}`, zIndex: 10 }}
  transition={{ duration: 0.2 }}
>
```

Outer entrance animation wraps the hover `motion.div` in a separate `motion.div` with `whileInView` stagger (see pattern 5.2).

### 4.18 Testimonials Marquee

Infinite horizontal scroll. Duplicated array creates seamless loop; `translateX(-50%)` returns to start.

```css
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
```

Edge fades (left/right):
```jsx
<div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
  style={{ background: "linear-gradient(to right, var(--bg), transparent)" }} />
```

Testimonial card: `motion.div` with gold glow (same as 4.17). Initials avatar: `w-9 h-9 rounded-full bg-[var(--accent-10)] border border-[var(--accent-30)]`. Attribution: `font-syne font-bold text-sm text-[var(--text-1)]` name + `font-mono text-[10px] text-[var(--text-3)]` role · company.

### 4.19 Footer

Rendered on `/`, `/blog`, `/blog/:slug`, `/games`. Not rendered on individual game pages or `/draw`.

```
bg-[var(--bg-deep)] border-t border-[var(--border)]
```

Gold gradient top accent (visual transition from page content):
```jsx
<div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-40)] to-transparent" />
```

Three-column layout (stacks on mobile):
- **Brand** — `font-syne font-bold text-[var(--text-1)]` name + `text-[var(--text-3)] text-sm` tagline
- **Nav links** — `text-sm text-[var(--text-3)] hover:text-[var(--accent)] transition-colors`
- **Social icons** — `w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)]` icon buttons, hover gold border + text

Bottom row (inside `border-t border-[var(--border)] pt-6`):
- Left: Copyright — `font-mono text-[11px] text-[var(--text-4)]`
- Center: **ThemeSwitcher + ModeToggle** — accent colour dots + sun/moon icon. These controls live exclusively in the Footer (not in Header).
  ```jsx
  <div className="flex items-center gap-2">
    <ThemeSwitcher />  {/* accent-colour dot buttons */}
    <div className="w-px h-4 bg-[var(--border)]" />
    <ModeToggle />     {/* Sun (dark mode) / Moon (light mode) */}
  </div>
  ```
- Right: "Built with" stack — `font-mono text-[11px] text-[var(--text-4)]`, tech names in `text-[var(--accent-70)]`

Entrance: `whileInView opacity 0→1, y 20→0, duration 0.5`.

### 4.20 Stats Strip

A narrow surface band between Hero and Experience showing key metrics with counting animations. Currently **commented out** in `App.jsx` — uncomment `<StatsStrip />` to activate.

```
bg-[var(--surface)] border-y border-[var(--border)] py-10 px-6 lg:px-12
```

Layout: `grid grid-cols-2 md:grid-cols-4 gap-8 text-center`

Each stat cell:
- Number: `font-syne font-bold text-3xl lg:text-4xl text-[var(--text-1)]` with gold suffix (`text-[var(--accent)]`)
- Label: `text-[var(--text-2)] text-sm tracking-wide`

Counting animation — driven by Framer Motion `useMotionValue` + `useTransform` + `useInView`:
```js
const count = useMotionValue(0);
const rounded = useTransform(count, Math.round);
const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

useEffect(() => {
  if (!inView) return;
  const controls = animate(count, targetValue, { duration: 1.5, ease: "easeOut" });
  return controls.stop;
}, [inView]);
// render: <motion.span>{rounded}</motion.span>
```

Strip entrance: `whileInView opacity 0→1, y 12→0, duration 0.5`. Items stagger at `0.1s` per cell.

---

## 5. Animation & Motion

All Framer Motion variants are declared at **module scope** (not inline) in `SCREAMING_SNAKE_CASE`. The common ones are centralised in `client/src/lib/animations.js` (`HEADER_ANIM`, `SUBHEADER_ANIM`, `CARD_BORDER`, `VIEWPORT_ONCE`, `cardVariants`, `cardVariantsSlow`) — import from there rather than redeclaring per component. The patterns below document the canonical shapes.

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

Use `theme.r35` / `theme.r45` / `theme.r50` from `useTheme()` for accent glows so they switch colour with the theme.

| Element | whileHover |
|---|---|
| Content card | `{ scale: 1.03, boxShadow: \`0 0 24px ${theme.r35}\` }` |
| Blog / preview card | `{ scale: 1.03, boxShadow: \`0 0 28px ${theme.r45}\`, zIndex: 10 }` |
| Large image / form / code window | `{ scale: 1.04, boxShadow: "0 0 40px rgba(0,98,255,0.2), 0 0 80px rgba(0,255,251,0.1)" }` |
| Photo (profile) | `{ scale: 1.05, boxShadow: "0 0 40px rgba(0,98,255,0.2), 0 0 80px rgba(0,255,251,0.15)" }` |
| Skill pill | `{ scale: 1.1, boxShadow: \`0 0 14px ${theme.r45}\`, borderColor: theme.r50 }` |
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
Icon colour in cards/containers: `text-[var(--accent)]`.
Icon colour in pills: tech-specific (e.g. `text-[#61DAFB]` for React).

---

## 8. Image Conventions

- Profile photo: `rounded-2xl ring-2 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--bg)]`
- Project preview thumbnail: `h-44 overflow-hidden border-b border-[var(--border)]` container, `object-cover object-top` image
- Alt text always descriptive; decorative images use `aria-hidden`

---

## 9. Page / Route Structure

```
/ (SPA)
  #home          → Hero + code window
               → StatsStrip (between Hero and Experience — currently commented out)
  #experience    → experience cards                          (02 — Professional Journey)
  #projects      → 2-col project cards                       (03 — Projects)
  #blog          → 3 latest posts preview, CTA to /blog      (04 — Dev Notes)
  #games         → 3 game cards (2048, Wordle, TypeRacer)    (05 — Side Quests)
  #skills        → icon cloud + 2×2 skill cards              (06 — Skills)
  #testimonials  → infinite marquee, 3 testimonial cards     (07 — Testimonials)
  #contact       → info panel + form                         (08 — Contact)

  About Me (01) lives inside Hero.jsx → renders PortfolioPage.jsx internally
  No top-level #about or #education anchor
  Testimonials is NOT in the Header nav or scroll-spy

/blog             → BlogIndex — search, tag filters, grid/list toggle
/blog/:slug       → BlogPost — full post, comments, likes
/games            → GamesIndex
/games/2048       → Game2048
/games/wordle     → GameWordle
/games/typeracer  → GameTyperacer
/draw             → DrawPage — canvas drawing tool
/pricing          → PricingPage — freelancing rate card (own PricingNav, no global Header/Footer)
```

Sections use `border-t border-[var(--border)]` between them for visual separation (About section).

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

1. **Use CSS vars for all background, text, and border values.** Never hardcode dark-mode hex values like `#111111`, `#1A1A1A`, `#2A2A2A` in new code — use `var(--bg)`, `var(--surface)`, `var(--border)` etc. so light mode works automatically. Exception: button text stays `text-[#111111]` (intentionally dark in both modes).
2. **Section heading follows the numbered pattern** (`09 — <Name>` for the next new section). Number in `text-[var(--accent)]`, em-dash, name in `text-[var(--text-1)]`. Current highest: `08 — Contact`.
3. **Section vertical padding is `py-24`.** Don't reduce to less than `py-16`.
4. **Cards use the three-part recipe** (surface bg + border + gold left-border inline style). Don't invent new card styles.
5. **All animations at module scope.** No inline Framer Motion objects.
6. **Hover glows use one of two palettes:** theme-switchable via `theme.r35` / `theme.r45` (from `useTheme()`) for content cards; blue-teal (`rgba(0,98,255,...)` + `rgba(0,255,251,...)`) for featured/hero elements.
7. **New content pages inherit the Header, GoldenCursor, and Footer** components. Fullscreen tool/game pages (individual game routes, /draw) omit the Footer.
8. **Font for any heading or button: `font-syne font-bold`.** Body text defaults to DM Sans (`font-sans`). Code always `font-mono`.
9. **Muted label pattern:** `text-xs uppercase tracking-widest text-[var(--text-3)]`
10. **Dividers inside cards:** `border-t border-[var(--border)]` — never a full horizontal rule (`<hr>`).
11. **Blog tag filters never change when a tag is active** — `allTags` is derived from the unfiltered response only.
12. **Empty states follow pattern 4.16** — icon, headline, context-aware message, clear-filters button.
13. **Admin panel stays permanently dark.** Never apply `var(--bg)` or mode vars to anything in `client/src/admin/`. Admin files use hardcoded hex values by design.
