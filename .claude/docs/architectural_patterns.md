# Architectural Patterns

Patterns observed across the portfolio **section components** (`client/src/components/`). Follow these when adding or editing sections.

> Scope: this file covers the single-page portfolio sections. The blog (`client/src/blog/`), games (`client/src/games/`), and draw tool (`client/src/draw/`) follow their own local conventions — see `docs/design-system.md` for blog UI patterns.

---

## 1. Module-Level Animation Constants

All Framer Motion prop objects are declared at module scope, never inline in JSX. Inline object literals create a new reference every render, which prevents Framer Motion from bailing out.

**Where:** Every section component — `Skills.jsx`, `Experience.jsx`, `Projects.jsx`, `Contact.jsx`, `FieldNotesSection.jsx`, `SideQuestsSection.jsx`, `TestimonialsSection.jsx`, `PortfolioPage.jsx`.

```
// Module level — correct
const HEADER_ANIM = { initial: ..., whileInView: ..., viewport: ..., transition: ... };

// JSX — spread it
<motion.div {...HEADER_ANIM}>
```

Named constants follow `SCREAMING_SNAKE_CASE`. Reused constants (e.g., `VIEWPORT_ONCE`, `CARD_HOVER`, `CARD_BORDER`) are defined once near the top of the file and referenced everywhere.

---

## 2. Card Convention

Every content card uses the same three-part recipe. See `Skills.jsx`, `Experience.jsx`, `Projects.jsx`.

1. **Tailwind classes** on the `motion.div`: `bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6`
2. **Inline style** for the gold left accent: `style={CARD_BORDER}` → `{ borderLeft: "3px solid var(--accent)" }` — done as inline style (not a Tailwind class) to avoid specificity conflicts with Tailwind's `border` shorthand
3. **Hover**: `whileHover={CARD_HOVER}` — uses `theme.r35` from `useTheme()` so the glow colour switches with the active theme. Scale differs per section: `1.03` for Skills/Projects, `1.05` for Experience.

All hardcoded hex values (`#1A1A1A`, `#2A2A2A`, `#888888`, `#FFFFFF`, etc.) in section components were replaced with CSS custom property equivalents (`var(--surface)`, `var(--border)`, `var(--text-2)`, `var(--text-1)`, etc.) as part of the dark/light mode implementation. **Admin panel files (`client/src/admin/`) retain hardcoded hex and are permanently dark — do not apply CSS vars there.**

---

## 3. whileInView Stagger Pattern

Cards in a list use a custom variant with a per-index delay, not individual `transition` props.

**Where:** `Skills.jsx`, `Experience.jsx`, `Projects.jsx`, `FieldNotesSection.jsx`, `SideQuestsSection.jsx`.

```js
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};
// Usage on each card:
// custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}
```

Delay step is `0.1s` per card; Projects uses `0.15s` (`Projects.jsx:12`) because the cards carry preview images. Section headers use a simpler spread: `{...HEADER_ANIM}` (no stagger, fires once on scroll).

---

## 4. Data-Driven Section Content

Section content (skill categories, experiences, projects) is declared as module-level `const` arrays, not inline in JSX. Components map over the array — no hardcoded repetition.

**Where:** `Skills.jsx` (`skillCategories`), `Experience.jsx` (`experiences`), `Projects.jsx` (`projects`), `SideQuestsSection.jsx` (`games`), `TestimonialsSection.jsx` (`testimonials`).

Icon components in data arrays are stored as component references (`SkillIcon: FaReact`), not as pre-instantiated JSX elements (`<FaReact />`). This allows passing props (like `aria-hidden`) at render time. See the `{ name, SkillIcon, color }` shape at `Skills.jsx:40-47`.

---

## 5. Section Accessibility Convention

The intended pattern for every section:

```jsx
<section aria-labelledby="[section]-heading" ...>
  <h2 id="[section]-heading" ...>
```

**Currently applied in:** `Experience.jsx`, `Contact.jsx`, `FieldNotesSection.jsx`, `SideQuestsSection.jsx`, `TestimonialsSection.jsx`, `Skills.jsx`, `Projects.jsx`.

Decorative icons always carry `aria-hidden="true"` (e.g. `Skills.jsx`, `Contact.jsx:118`).

---

## 6. Contact Form Handling

`Contact.jsx` contains all form logic. Key patterns:

- Validation extracted to a pure module-level function `validateForm(data)` (`Contact.jsx:36-44`) — accepts data, returns an errors object, no side effects
- `handleChange` uses `useCallback` with a functional state updater to avoid stale closures and keep a stable reference (`Contact.jsx:52-56`)
- `loading` state prevents double-submit; button gains `disabled` + opacity during fetch (`Contact.jsx:50`)
- Success status auto-clears after 5 seconds via `setTimeout` (`Contact.jsx:78`)
- `inputClass(error)` (`Contact.jsx:28-32`) is a plain template-literal helper that swaps border colors on validation error — note it does **not** use `cn()` (the conflicting classes are mutually exclusive branches)

---

## 7. Personal Data Indirection

All personal URLs and contact details are imported from `client/src/constants/index.js`:
- `myEmail`, `myLocation`, `myPincode` — used in `Contact.jsx`
- `myGithub`, `myLinkedIn` — used in `Contact.jsx`, `Footer.jsx`, `CommandPalette.jsx`, and `Projects.jsx` (project repo URLs derived as `` `${myGithub}/repo-name` ``)

The only remaining hardcoded value is the Web3Forms access key in `Contact.jsx` — it is not a personal URL and is intentionally left there.

---

## 8. `cn()` Utility

Conditional Tailwind classes use `cn()` from `client/src/lib/utils.js` (clsx + tailwind-merge). Used primarily in the shadcn/ui primitives (`client/src/components/ui/`). When merging Tailwind strings where classes may **conflict** (e.g. two competing `border-*` values), use `cn()` rather than template-literal concatenation so tailwind-merge can resolve the winner.

---

## 9. Animated Counter Pattern (`StatsStrip.jsx`)

`StatsStrip.jsx` (currently commented out in `App.jsx`) uses a `Counter` sub-component that animates a number from 0 to a target value when scrolled into view.

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

Key points:
- `useMotionValue` holds the raw (fractional) count; `useTransform(count, Math.round)` produces an integer for display
- `animate(count, value, ...)` drives the motion value directly — no React state, no re-render loop
- `useInView` with `once: true` fires the animation exactly once on first scroll-into-view
- The `margin` option pre-triggers the animation slightly before the element is fully visible

---

## 10. Mode & Theme System

`client/src/lib/ThemeContext.jsx` manages two orthogonal axes:

| Axis | `localStorage` key | `<html>` attribute | Controls |
|---|---|---|---|
| **Accent theme** | `portfolio-theme` | `data-theme` | Which accent colour (gold / blue / purple). CSS vars `--accent`, `--accent-dark`, `--accent-05..70` |
| **Light/dark mode** | `portfolio-mode` | `data-mode` | Which surface/text palette (dark default / light). CSS vars `--bg`, `--surface`, `--border`, `--text-1..4`, `--bg-95`, `--bg-deep` |

Both are set on `document.documentElement` (the `<html>` element) and persisted to `localStorage`.

The context exposes `{ theme, setTheme, mode, setMode }`. Components that need theme-coloured glows (`theme.r35`, `theme.r45`, `theme.r50`) call `useTheme()` and use those pre-computed rgba strings in Framer Motion `boxShadow` values.

**Toggle controls live in Footer only** — `ThemeSwitcher` (accent dots) and `ModeToggle` (sun/moon icon) are sub-components of `Footer.jsx`. They are not in the Header.

**Tailwind opacity modifier incompatibility** — `bg-[#111111]/95` uses Tailwind's built-in opacity modifier which is computed at build time and cannot be combined with CSS variables. The pre-computed `--bg-95` var sidesteps this. When adding new opacity variants, define a pre-computed var in `index.css` rather than using the `/opacity` modifier with a CSS var.

## Note on `Education.jsx`

`Education.jsx` still exists in `client/src/components/` and follows these same patterns, but it is **orphaned** — it is not rendered anywhere in `App.jsx`. Treat it as dead code unless deliberately reintroduced.

## New Section Components (added 2026-06)

Three new sections live between Projects and Skills:

| Component | Section ID | Number | Notes |
|---|---|---|---|
| `FieldNotesSection.jsx` | `#blog` | 04 | Fetches 3 latest posts via `getPosts(1)` from the API; falls back gracefully on error |
| `SideQuestsSection.jsx` | `#games` | 05 | Static data — no API call; links to `/games/2048`, `/games/wordle`, `/games/typeracer` |
| `TestimonialsSection.jsx` | `#testimonials` | 07 | Infinite CSS marquee; NOT in Header nav or scroll-spy; pauses on hover |

The gold glow card pattern for `FieldNotesSection` and `SideQuestsSection` differs from the standard content card (4.1 in design-system.md): there is **no gold left border** and box-shadow is `0 0 28px rgba(232,184,75,0.45)` (stronger than the standard `0.35`). The `motion.div` carries the card background/border/radius so the shadow renders correctly against the rounded shape.
