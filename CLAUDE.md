# Portfolio — Claude Context

## Purpose
Ankit Bhardwaj's personal portfolio. Target audience: recruiters and freelancing clients.
Single-page app — all sections live on one scrollable page, navigated via anchor links.

## Tech Stack
- **React 18** + **Vite 6** (ESM, `@` alias → `src/`)
- **Tailwind CSS v3** — utility-first, no CSS modules
- **Framer Motion v11** — all animations
- **Prism.js** — syntax highlighting in the Hero code window
- **react-router-hash-link** — smooth-scroll anchor navigation
- **shadcn/ui** primitives (Radix UI) — in `src/components/ui/`, not actively used in main sections
- **Web3Forms** — contact form submission (client-side, no backend)

## Key Directories

| Path | Purpose |
|---|---|
| `src/components/` | One file per page section + `globe.jsx` (icon cloud wrapper) |
| `src/components/ui/` | shadcn/ui primitives — treat as read-only vendor code |
| `src/assets/css/index.css` | Design tokens, Google Fonts import, Prism theme, shadcn CSS vars |
| `src/constants/index.js` | Personal data (email, location, pincode) — edit here, not in components |
| `src/lib/utils.js` | `cn()` helper — Tailwind class merging via clsx + tailwind-merge |
| `tailwind.config.js` | Font families (`font-syne`, `font-sans`, `font-mono`) + shadcn color tokens |
| `docs/superpowers/` | Design spec and implementation plan from the revamp project |

## Page Structure (`src/App.jsx`)
Sections render in order, each wrapped in a `<div id="...">` for anchor targeting:
`home` → `skills` → `experience` → `education` → `contact`

`Hero.jsx` renders `PortfolioPage.jsx` (About section) internally — About is not a top-level App child.

## Build & Dev Commands
```
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview dist/ locally
npm run lint      # ESLint
```

## Design System (Dark Refined)
Defined in `src/assets/css/index.css`. Core tokens:
- Background `#111111` · Surface `#1A1A1A` · Border `#2A2A2A`
- Gold accent `#E8B84B` · Secondary text `#888888`
- Section headings: `font-syne font-bold text-4xl lg:text-5xl`
- Section numbering pattern: `01 — About Me`, `02 — Skills`, …

## Personal Data
Edit `src/constants/index.js` to update email, location, and pincode.
Hard-coded values (GitHub URL, LinkedIn URL, Web3Forms key) live in `src/components/Contact.jsx`.

## Additional Documentation
Check these files when relevant:

- **[.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md)** — Animation patterns, card conventions, module-level constant pattern, form handling, icon usage. Read before adding or editing any section component.
