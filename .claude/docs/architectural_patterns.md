# Architectural Patterns

Patterns observed across multiple section components. Follow these when adding or editing sections.

---

## 1. Module-Level Animation Constants

All Framer Motion prop objects are declared at module scope, never inline in JSX. Inline object literals create a new reference every render, which prevents Framer Motion from bailing out.

**Where:** Every section component (`Skills.jsx:24-29`, `Experience.jsx:12-24`, `Education.jsx:13-29`, `Contact.jsx:7-26`, `PortfolioPage.jsx:4-23`).

```
// Module level — correct
const HEADER_ANIM = { initial: ..., whileInView: ..., viewport: ..., transition: ... };

// JSX — spread it
<motion.div {...HEADER_ANIM}>
```

Named constants follow `SCREAMING_SNAKE_CASE`. Reused constants (e.g., `VIEWPORT_ONCE`, `CARD_HOVER`, `CARD_BORDER`) are defined once and referenced everywhere in the file.

---

## 2. Card Convention

Every content card uses the same three-part recipe. See `Skills.jsx:101-130`, `Experience.jsx:69-95`, `Education.jsx:82-148`.

1. **Tailwind classes** on the `motion.div`: `bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6`
2. **Inline style** for the gold left accent: `style={CARD_BORDER}` → `{ borderLeft: "3px solid #E8B84B" }` — done as inline style (not a Tailwind class) to avoid specificity conflicts with Tailwind's `border` shorthand
3. **Hover**: `whileHover={CARD_HOVER}` → `{ scale: 1.01 }`

---

## 3. whileInView Stagger Pattern

Cards in a list use a custom variant with a per-index delay, not individual `transition` props.

**Where:** `Skills.jsx:15-22`, `Experience.jsx:3-10`, `Education.jsx:3-10`.

```js
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};
// Usage on each card:
// custom={i} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} variants={cardVariants}
```

Section headers use a simpler spread: `{...HEADER_ANIM}` (no stagger, fires once on scroll).

---

## 4. Data-Driven Section Content

Section content (experiences, education records, skill categories) is declared as module-level `const` arrays, not inline in JSX. Components map over the array — no hardcoded repetition.

**Where:** `Experience.jsx:28-50`, `Education.jsx:32-65`, `Skills.jsx:33-79`.

Icon components in data arrays are stored as component references (`SkillIcon: FaReact`), not as pre-instantiated JSX elements (`<FaReact />`). This allows passing props (like `aria-hidden`) at render time.

See `Skills.jsx:37-79` for the `{ name, SkillIcon, color }` shape.

---

## 5. Section Accessibility Convention

Every section follows this pattern (introduced during the revamp):

```jsx
<section aria-labelledby="[section]-heading" ...>
  <h2 id="[section]-heading" ...>
```

**Where:** `Experience.jsx:54`, `Education.jsx:66`, `Contact.jsx:85`.

Decorative icons always carry `aria-hidden="true"`. See `Skills.jsx:108`, `Education.jsx:107`, `Contact.jsx:110`.

---

## 6. Contact Form Handling

`Contact.jsx` contains all form logic. Key patterns:

- Validation extracted to a pure module-level function `validateForm(data)` (`Contact.jsx:38-46`) — accepts data, returns an errors object, no side effects
- `handleChange` uses `useCallback` with a functional state updater to avoid stale closures and stable references (`Contact.jsx:53-57`)
- `loading` state prevents double-submit; button gains `disabled` + opacity during fetch (`Contact.jsx:49`, `Contact.jsx:170`)
- Success status auto-clears after 5 seconds via `setTimeout` (`Contact.jsx:75`)

---

## 7. Personal Data Indirection

Contact details that appear in the UI are imported from `src/constants/index.js`, not hardcoded in components. Hard-coded exceptions (URLs that are unlikely to change) live in `Contact.jsx` directly: Web3Forms key, GitHub URL, LinkedIn URL.

---

## 8. `cn()` Utility

Conditional Tailwind classes use `cn()` from `src/lib/utils.js` (clsx + tailwind-merge). Used in shadcn/ui primitives (`src/components/ui/`) and `Contact.jsx`'s `inputClass` helper. Do not concatenate Tailwind strings with template literals when classes conflict — use `cn()`.
