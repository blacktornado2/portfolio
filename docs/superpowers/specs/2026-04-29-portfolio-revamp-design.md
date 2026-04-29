# Portfolio Revamp Design Spec
**Date:** 2026-04-29  
**Project:** Ankit Bhardwaj — Personal Portfolio  
**Stack:** React 18 + Tailwind CSS v3 + Framer Motion + Vite  
**Audience:** Recruiters and freelancing clients  
**Tone:** Clean, professional, memorable

---

## 1. Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#111111` | Page background |
| `--surface` | `#1A1A1A` | Cards, code window |
| `--border` | `#2A2A2A` | Card borders, dividers |
| `--text-primary` | `#FFFFFF` | Headings, labels |
| `--text-secondary` | `#888888` | Body text, descriptions |
| `--accent` | `#E8B84B` | Gold — CTAs, highlights, border-left on cards |
| `--accent-dim` | `#E8B84B15` | Subtle accent backgrounds |
| `--green` | `#22C55E` | "Available" dot, boolean `true` in code |

### Typography
| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings | **Syne** | 700–800 | Google Font — geometric, distinctive |
| Body / UI | **DM Sans** | 400–500 | Clean, readable |
| Code window | **JetBrains Mono** | 400 | Monospace identity element |

All three loaded via `@import` in `index.css`. No new npm packages.

### Spacing & Radius
- Section vertical padding: `py-24` (6rem)
- Card border-radius: `rounded-xl` (12px)
- Card padding: `p-6` (1.5rem)
- Left accent border width: `3px solid #E8B84B`

### Removed Permanently
- Meteor effects (`Meteors` component)
- `SparklesText` component
- `FlipWords` animated role cycling
- Animated grid lines background
- All gradient text (`gradient-text` class)
- All glow blurs (`bg-blue-500/20 blur-3xl` etc.)
- Floating animated badges ("Clean Code", "Innovation")
- `animate__animated` Animate.css classes

---

## 2. Global Layout

### CSS Variables (added to `index.css` `:root`)
```css
--bg: #111111;
--surface: #1A1A1A;
--border: #2A2A2A;
--text-primary: #FFFFFF;
--text-secondary: #888888;
--accent: #E8B84B;
```

### Body
Background `#111111`. Font: DM Sans. Text: `#FFFFFF`.

### Section Structure Pattern
Every section uses this heading pattern:
```
[number] — [Title]
```
e.g. `01 — About`, `02 — Skills`, `03 — Professional Journey`

The number is rendered in `#E8B84B` (gold), the dash and title in white.

---

## 3. Navigation (`Header.jsx`)

**Style:** Full-width fixed top bar.

**Layout:**
- Left: `Ankit Bhardwaj` in Syne bold, white
- Right: nav links (`Skills · Experience · Education · Contact`) in DM Sans, `#888888`, spaced with `gap-8`
- Far right: `Hire Me` button — solid gold `#E8B84B` bg, `#111111` text, `rounded-md px-4 py-2`, Syne font

**Scroll behaviour:** Background transitions from `transparent` to `#111111/95 backdrop-blur-sm` once scrolled past 60px. Uses a `useEffect` scroll listener.

**Active link:** Gold underline (`border-b-2 border-[#E8B84B]`) on the currently active section. Determined by IntersectionObserver on section IDs.

**Hover:** All links get a gold underline on hover via Tailwind `hover:text-[#E8B84B] transition-colors`.

**Mobile:** Hamburger icon (Lucide `Menu`). Opens a vertical drawer from the top with the same links. `Hire Me` button at the bottom of drawer.

**Removes:** Gradient border pill, `animate-gradient-x`, per-link icon display.

---

## 4. Hero Section (`Hero.jsx`)

**Layout:** Two-column 50/50 on desktop, single column stacked on mobile.

### Left Column
1. **Availability badge** — small pill: green dot `●` + `"Available for work"` in `#888888`, `bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-4 py-1.5 text-sm`
2. **Name** — `Hello, I'm` in DM Sans secondary, then `Ankit Bhardwaj` in Syne `text-5xl lg:text-7xl font-bold`. "Bhardwaj" (or the whole name) in `text-[#E8B84B]`
3. **Role line** — `Full-Stack Developer · React Native · Node.js` in `#888888`, DM Sans
4. **Bio** — 2-line description in `#888888` max-w-md
5. **CTA buttons:**
   - Primary: `Hire Me` — solid `#E8B84B` bg, `#111` text, Syne bold, `rounded-lg px-6 py-3`
   - Secondary: `Download CV` — outlined `border border-[#2A2A2A]`, `#888` text, same size. Links to a PDF (placeholder `href="#"` until user provides link)

**Framer Motion:** Each left-column element fades in and slides up with `initial={{ opacity:0, y:20 }}` → `animate={{ opacity:1, y:0 }}` with `delay` increments of 0.1s.

### Right Column — Code Window
Restyled with the new palette. Structure unchanged (Prism.js syntax highlighting).

- Outer wrapper: `bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden`
- Window header: `bg-[#161616] px-4 py-3 flex items-center gap-2 border-b border-[#2A2A2A]`
- Traffic lights: red `#EF4444`, yellow `#F59E0B`, green `#22C55E` (no change)
- Filename label: `developer.js` in `#555`, JetBrains Mono
- Code body: `bg-[#1A1A1A]`, custom Prism theme — keywords in `#E8B84B`, strings in `#d4c090`, properties in `#888888`, brackets in `#FFFFFF`
- Font: JetBrains Mono, `text-sm`

**Framer Motion:** Code window fades in from right (`initial={{ opacity:0, x:40 }}`) on load.

### Removes from Hero
- `AnimatedGrid` component
- `Meteors` component
- `SparklesText` around "Hello"
- `FlipWords` role cycling
- All decorative blur divs
- Floating badge divs

---

## 5. About Section (`PortfolioPage.jsx`)

Rendered inside `Hero.jsx`'s `<main>` tag, immediately after the hero `<section>`. Effectively "section 01" in the page flow.

**Section header:** `01 — About Me`

**Layout:** Two-column on desktop — text left, profile photo right. Single column stacked on mobile.

**Left column:**
- `WHO AM I?` label replaced with the standard `01 — About Me` section header pattern
- Bio text kept as-is, restyled: DM Sans `text-[#888888] leading-relaxed text-lg`
- Name highlight: `text-[#E8B84B] font-semibold` (replacing `text-orange-400`)
- Remove `font-mono` from this section (bio text should be readable DM Sans)

**Right column:**
- Profile image kept: `h-80 w-80 rounded-full object-cover`
- Add a subtle gold ring: `ring-2 ring-[#E8B84B] ring-offset-4 ring-offset-[#111111]`

**Background:** `bg-[#111111]` (flat, no gradient). Section separated from Hero by a `border-t border-[#2A2A2A]`.

---

## 6. Skills Section (`Skills.jsx`)

**Section header:** `02 — Skills`


**Icon Cloud:** Kept as-is (`globe.jsx` / `react-icon-cloud`). Centered, capped at `max-w-lg mx-auto`. Provides the visual "tech identity" moment.

**Skill cards:** 4 categories in a `grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6` grid (2×2 on large screens).

Each card uses the **left gold border** style:
```
bg-[#1A1A1A] rounded-xl border-l-[3px] border-l-[#E8B84B] border border-[#2A2A2A] p-6
```
- Category icon + title in a flex row (icon `text-[#E8B84B]`, title in Syne bold white)
- Hairline divider `border-t border-[#2A2A2A] my-4`
- Skill badges: `bg-[#111] border border-[#2A2A2A] text-[#888] rounded-md px-3 py-1.5 text-sm flex items-center gap-2`

**Framer Motion:** Cards stagger in with `whileInView` + `viewport={{ once: true }}`, each delayed by `index * 0.1s`.

**Removes:** `animate-shimmer` overlay, gradient card borders, `group-hover:scale-110` icon, `hover:shadow-[0_0_2rem_-0.5rem_#60A5FA]` glow.

---

## 6. Experience Section (`Experience.jsx`)

**Section header:** `03 — Professional Journey`  
**Sub-heading:** `"Transforming ideas into digital reality, one project at a time"` — kept in `#888`, DM Sans italic, centered, below the header.

**Layout:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

Each card — **left gold border** style:
- **Top row:** Role title (Syne, white, bold) + period badge (`bg-[#111] border border-[#2A2A2A] text-[#888] text-xs rounded-md px-2 py-1`)
- Company name: `text-[#E8B84B]` DM Sans medium, below title
- Hairline divider
- Description: `#888888`, DM Sans, `text-sm leading-relaxed`

**Framer Motion:** `whileInView` stagger, same pattern as Skills.

**Removes:** Glassmorphism overlay, animated gradient border on hover, floating icon pulse, animated particle divs, corner decorative lines.

---

## 7. Education Section (`Education.jsx`)

**Section header:** `04 — Education`  
**Sub-heading:** `"Discover how academic excellence shapes innovative thinking and professional growth."` — kept.

**Layout:** `grid-cols-1 md:grid-cols-2 gap-6`. Three cards — last one centered (`md:col-span-2 md:max-w-lg md:mx-auto` or just let it be left-aligned; implementation detail).

Each card — **left gold border** style:
- Degree: Syne bold white
- School: `text-[#888]` with a `BookOpen` icon
- Year: small badge
- Achievement pill: `bg-[#E8B84B15] text-[#E8B84B] border border-[#E8B84B33] rounded-full px-3 py-1 text-xs`
- Description: italic `#888`, `border-l-2 border-[#2A2A2A] pl-3`
- Subject tags: flat `bg-[#111] text-[#666] border border-[#2A2A2A]`

**Removes:** `motion.div` with `animate="visible"` immediately on mount (replace with `whileInView`). Emoji mascots (💻 📘 📕) are **kept** — they add personality and help scanability.

---

## 8. Contact Section (`Contact.jsx`)

**Section header:** `05 — Contact`

**Layout:** Two columns on desktop. Left: info. Right: form.

**Left column:**
- Heading: `"Let's build something"` in Syne bold, `text-3xl`, white
- Sub-text: current copy kept, `#888`
- Email row: `Mail` icon in `#E8B84B`, email as gold-hover link
- Location row: `MapPin` icon in `#E8B84B`, location text
- (Optional) GitHub link with `FaGithub` icon

**Right column — Form:**
- Container: `bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8`
- Inputs: `bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:border-[#E8B84B] focus:outline-none transition-colors`
- Submit button: solid `bg-[#E8B84B] text-[#111] font-bold rounded-lg py-3 px-6 hover:bg-[#d4a83e] transition-colors flex items-center gap-2`
- Error states: `border-red-500` on input, `text-red-400 text-xs mt-1` for messages
- Success/error status message styled consistently

**Removes:** `backdrop-blur-lg bg-white/5` frosted glass container.

---

## 9. Animation Summary

All animations use Framer Motion (already installed `^11.15.0`).

| Element | Animation |
|---|---|
| Hero left column items | Staggered `fadeInUp` on mount, 0.1s delays |
| Hero code window | `fadeInRight` on mount |
| Section headers | `fadeInUp` on `whileInView` |
| All cards | Staggered `fadeInUp` on `whileInView`, `once: true` |
| Nav background | CSS `transition` on scroll (not Framer Motion) |
| Card hover | `whileHover={{ scale: 1.01 }}` |
| Nav link hover | CSS `transition-colors` + Tailwind `hover:text-[#E8B84B]` |

No `animate__animated` Animate.css classes used anywhere.

---

## 10. File Change Summary

| File | Change |
|---|---|
| `src/assets/css/index.css` | Add Google Font imports, CSS variables, remove old gradient/glow classes |
| `tailwind.config.js` | Add `fontFamily` for Syne and DM Sans |
| `src/components/Header.jsx` | Full rewrite — top bar nav, scroll behaviour, active section tracking |
| `src/components/Hero.jsx` | Full rewrite — remove magic-ui components, restyle code window |
| `src/components/Skills.jsx` | Rewrite card styles, keep globe, remove shimmer/glow |
| `src/components/Experience.jsx` | Rewrite cards, remove glassmorphism/particles |
| `src/components/Education.jsx` | Rewrite cards, switch to `whileInView` |
| `src/components/Contact.jsx` | Rewrite form + info styles |
| `src/components/PortfolioPage.jsx` | Restyle About section — remove gradient, apply gold ring to photo, restyle bio text |
| `src/assets/css/Header.css` | Delete (styles moved inline / to index.css) |

`PortfolioPage.jsx`, `globe.jsx`, `Contact.jsx` logic (form submit), `constants/index.js` — unchanged.

---

## 11. Out of Scope

- Projects section (placeholder slot kept in App.jsx, commented out — no design needed yet)
- Resume/CV PDF (Download CV button links to `#` until user provides file)
- Dark/light toggle (dark-only)
- Any new npm package installations
