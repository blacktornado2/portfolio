# Architectural Patterns

Patterns observed across the portfolio **section components** (`client/src/components/`). Follow these when adding or editing sections.

> Scope: this file covers the single-page portfolio sections. The blog (`client/src/blog/`), games (`client/src/games/`), and draw tool (`client/src/draw/`) follow their own local conventions — see `docs/design-system.md` for blog UI patterns.

---

## 1. Module-Level Animation Constants

All Framer Motion prop objects are declared at module scope, never inline in JSX. Inline object literals create a new reference every render, which prevents Framer Motion from bailing out.

**Where:** Every section component — `Skills.jsx:16-33`, `Experience.jsx:3-28`, `Projects.jsx:7-31`, `Contact.jsx:7-34`, `PortfolioPage.jsx:4-23`.

```
// Module level — correct
const HEADER_ANIM = { initial: ..., whileInView: ..., viewport: ..., transition: ... };

// JSX — spread it
<motion.div {...HEADER_ANIM}>
```

Named constants follow `SCREAMING_SNAKE_CASE`. Reused constants (e.g., `VIEWPORT_ONCE`, `CARD_HOVER`, `CARD_BORDER`) are defined once near the top of the file and referenced everywhere.

---

## 2. Card Convention

Every content card uses the same three-part recipe. See `Skills.jsx:110-130`, `Experience.jsx:70-95`, `Projects.jsx:85-97`.

1. **Tailwind classes** on the `motion.div`: `bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6`
2. **Inline style** for the gold left accent: `style={CARD_BORDER}` → `{ borderLeft: "3px solid #E8B84B" }` — done as inline style (not a Tailwind class) to avoid specificity conflicts with Tailwind's `border` shorthand
3. **Hover**: `whileHover={CARD_HOVER}` — the glow is shared (`boxShadow: "0 0 24px rgba(232,184,75,0.35)"`), but the scale differs per section: `1.03` for Skills/Projects, `1.05` for Experience.

---

## 3. whileInView Stagger Pattern

Cards in a list use a custom variant with a per-index delay, not individual `transition` props.

**Where:** `Skills.jsx:16-23`, `Experience.jsx:3-10`, `Projects.jsx:7-14`.

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

**Where:** `Skills.jsx:35-88` (`skillCategories`), `Experience.jsx:30-52` (`experiences`), `Projects.jsx:33-68` (`projects`).

Icon components in data arrays are stored as component references (`SkillIcon: FaReact`), not as pre-instantiated JSX elements (`<FaReact />`). This allows passing props (like `aria-hidden`) at render time. See the `{ name, SkillIcon, color }` shape at `Skills.jsx:40-47`.

---

## 5. Section Accessibility Convention

The intended pattern for every section:

```jsx
<section aria-labelledby="[section]-heading" ...>
  <h2 id="[section]-heading" ...>
```

**Currently applied in:** `Experience.jsx:56,61` and `Contact.jsx:90,95`.

> **Inconsistency to fix:** `Skills.jsx:92` and `Projects.jsx:72` do **not** yet set `aria-labelledby` / matching `h2 id`. When editing those sections, add them to bring them in line.

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

Contact details that appear in the UI are imported from `client/src/constants/index.js`, not hardcoded in components (`Contact.jsx:5` → `myEmail`, `myLocation`, `myPincode`). Hard-coded exceptions (URLs unlikely to change) live in `Contact.jsx` directly: Web3Forms access key (`Contact.jsx:65`), GitHub URL, LinkedIn URL.

---

## 8. `cn()` Utility

Conditional Tailwind classes use `cn()` from `client/src/lib/utils.js` (clsx + tailwind-merge). Used primarily in the shadcn/ui primitives (`client/src/components/ui/`). When merging Tailwind strings where classes may **conflict** (e.g. two competing `border-*` values), use `cn()` rather than template-literal concatenation so tailwind-merge can resolve the winner.

---

## Note on `Education.jsx`

`Education.jsx` still exists in `client/src/components/` and follows these same patterns, but it is **orphaned** — `App.jsx` renders `Projects.jsx` at section `04`, not Education. Treat Education as dead code unless deliberately reintroduced.
