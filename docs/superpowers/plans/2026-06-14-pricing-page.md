# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/pricing` page accessible by URL only, showing freelance service tiers in horizontal rows with a CTA banner.

**Architecture:** Five focused components under `client/src/pricing/` — a slim navbar, hero blurb, reusable row, CTA banner, and a page root that wires them together with the row data. One new route added to `App.jsx`. No server changes.

**Tech Stack:** React 18, Framer Motion 11, Tailwind CSS v3, Lucide React (icons), `client/src/lib/animations.js` for motion presets, `client/src/constants/index.js` for email.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `client/src/pricing/PricingNav.jsx` | Slim top bar: logo monogram + back link |
| Create | `client/src/pricing/PricingHero.jsx` | "Available for work" badge + headline + subtext |
| Create | `client/src/pricing/PricingRow.jsx` | Reusable row: icon, title, description, tech pills, price |
| Create | `client/src/pricing/PricingCTA.jsx` | Full-width bottom CTA banner with email button |
| Create | `client/src/pricing/PricingPage.jsx` | Page root: row data array + layout |
| Create | `client/src/pricing/PricingPage.test.jsx` | Vitest render tests |
| Modify | `client/src/App.jsx` | Add `<Route path="/pricing" element={<PricingPage />} />` |

---

## Task 1: PricingNav — slim navbar

**Files:**
- Create: `client/src/pricing/PricingNav.jsx`

- [ ] **Step 1: Create the component**

```jsx
// client/src/pricing/PricingNav.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PricingNav() {
  return (
    <nav className="bg-[var(--bg-deep)] border-b border-[var(--border)] px-6 lg:px-12 py-4 flex items-center justify-between">
      <span className="font-syne font-bold text-lg text-[var(--accent)]">AB</span>
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pricing/PricingNav.jsx
git commit -m "feat: add PricingNav slim navbar component"
```

---

## Task 2: PricingHero — headline section

**Files:**
- Create: `client/src/pricing/PricingHero.jsx`

- [ ] **Step 1: Create the component**

```jsx
// client/src/pricing/PricingHero.jsx
import { motion } from "framer-motion";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";

export default function PricingHero() {
  return (
    <section className="px-6 lg:px-12 py-16 border-b border-[var(--border)]">
      <div className="max-w-3xl">
        <motion.div {...HEADER_ANIM}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Available for work
          </span>
        </motion.div>

        <motion.h1
          {...SUBHEADER_ANIM}
          className="font-syne font-bold text-4xl lg:text-5xl leading-tight mb-4 text-[var(--text-1)]"
        >
          Let's build something{" "}
          <span className="text-[var(--accent)]">worth shipping.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[var(--text-2)] text-base lg:text-lg max-w-xl leading-relaxed"
        >
          Transparent pricing, no retainer lock-in. Pick a scope that fits and
          reach out — I'll get back within 24 hours.
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pricing/PricingHero.jsx
git commit -m "feat: add PricingHero headline section"
```

---

## Task 3: PricingRow — reusable row component

**Files:**
- Create: `client/src/pricing/PricingRow.jsx`

`PricingRow` accepts these props:
- `icon` — a Lucide React icon component
- `title` (string)
- `price` (string) — e.g. `"$500"` or `"Let's Talk"`
- `description` (string)
- `pills` (string[]) — tech stack labels, can be empty
- `highlighted` (boolean) — gold border + "Most Popular" badge
- `custom` (boolean) — dashed border, darker bg, muted price
- `index` (number) — stagger delay

- [ ] **Step 1: Create the component**

```jsx
// client/src/pricing/PricingRow.jsx
import { motion } from "framer-motion";
import { cardVariants } from "../lib/animations";

export default function PricingRow({
  icon: Icon,
  title,
  price,
  description,
  pills = [],
  highlighted = false,
  custom = false,
  index = 0,
}) {
  const borderClass = custom
    ? "border border-dashed border-[var(--border)]"
    : highlighted
    ? "border border-[var(--accent)]/30"
    : "border border-[var(--border)]";

  const bgClass = custom ? "bg-[var(--bg-deep)]" : "bg-[var(--surface)]";

  const iconBgClass = highlighted
    ? "bg-[var(--accent)]/20 border border-[var(--accent)]/40"
    : custom
    ? "bg-[var(--bg)] border border-[var(--border)]"
    : "bg-[var(--accent)]/10 border border-[var(--accent)]/20";

  const priceClass = custom
    ? "text-[var(--text-3)]"
    : "text-[var(--accent)]";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className={`relative flex gap-5 items-start rounded-xl p-5 ${bgClass} ${borderClass}`}
    >
      {highlighted && (
        <div className="absolute -top-px right-5 bg-[var(--accent)] rounded-b-md px-3 py-0.5">
          <span className="text-[#111111] text-[10px] font-bold tracking-widest uppercase">
            Most Popular
          </span>
        </div>
      )}

      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        <Icon className="w-5 h-5 text-[var(--accent)]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4 mb-1.5">
          <span className="font-syne font-semibold text-[var(--text-1)] text-base">
            {title}
          </span>
          <span className={`font-syne font-bold text-base whitespace-nowrap ${priceClass}`}>
            {price}
          </span>
        </div>

        <p className="text-[var(--text-2)] text-sm leading-relaxed mb-3">
          {description}
        </p>

        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-0.5 text-[10px] text-[var(--text-3)] tracking-wide"
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pricing/PricingRow.jsx
git commit -m "feat: add reusable PricingRow component"
```

---

## Task 4: PricingCTA — bottom CTA banner

**Files:**
- Create: `client/src/pricing/PricingCTA.jsx`

- [ ] **Step 1: Create the component**

Uses `myEmail` from constants so the contact email stays consistent with the rest of the portfolio.

```jsx
// client/src/pricing/PricingCTA.jsx
import { motion } from "framer-motion";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";
import { myEmail } from "../constants";

export default function PricingCTA() {
  return (
    <section className="bg-[var(--bg-deep)] border-t border-[var(--accent)]/20 px-6 lg:px-12 py-16 text-center">
      <motion.p
        {...HEADER_ANIM}
        className="text-[var(--text-4)] text-xs uppercase tracking-widest mb-3"
      >
        Ready to start?
      </motion.p>

      <motion.h2
        {...SUBHEADER_ANIM}
        className="font-syne font-bold text-3xl lg:text-4xl text-[var(--text-1)] mb-3"
      >
        Have a project in mind?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-[var(--text-2)] text-sm mb-8"
      >
        I typically respond within 24 hours.
      </motion.p>

      <motion.a
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.03 }}
        href={`mailto:${myEmail}`}
        className="inline-block bg-[var(--accent)] text-[#111111] font-syne font-bold text-sm px-8 py-3.5 rounded-lg tracking-wide hover:bg-[var(--accent-dark)] transition-colors"
      >
        Get in Touch →
      </motion.a>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pricing/PricingCTA.jsx
git commit -m "feat: add PricingCTA bottom banner"
```

---

## Task 5: PricingPage — page root + row data

**Files:**
- Create: `client/src/pricing/PricingPage.jsx`

- [ ] **Step 1: Create the page**

Row data lives here as a const — easy to update prices without touching component logic.

```jsx
// client/src/pricing/PricingPage.jsx
import { Monitor, Zap, MessageCircle } from "lucide-react";
import PricingNav from "./PricingNav";
import PricingHero from "./PricingHero";
import PricingRow from "./PricingRow";
import PricingCTA from "./PricingCTA";

const ROWS = [
  {
    icon: Monitor,
    title: "Landing Page",
    price: "$500",
    description:
      "Static site — no backend, no database. React + Tailwind + Framer Motion. Mobile-first, fast, and accessible out of the box.",
    pills: ["React", "Tailwind", "Framer Motion", "Vite"],
    highlighted: false,
    custom: false,
  },
  {
    icon: Zap,
    title: "Full Stack Application",
    price: "Starting $1,500",
    description:
      "End-to-end web apps with REST API, database, auth, and deployment. Built for scale from day one.",
    pills: ["NestJS", "Prisma", "PostgreSQL", "JWT Auth"],
    highlighted: true,
    custom: false,
  },
  {
    icon: MessageCircle,
    title: "Custom / Ongoing",
    price: "Let's Talk",
    description:
      "Complex architectures, long-term contracts, consulting, code audits — anything that doesn't fit a box. Reach out with your project details.",
    pills: [],
    highlighted: false,
    custom: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)]">
      <PricingNav />
      <PricingHero />

      <section className="px-6 lg:px-12 py-12 max-w-3xl mx-auto">
        <p className="text-[var(--text-4)] text-xs uppercase tracking-widest mb-6">
          Services
        </p>
        <div className="flex flex-col gap-4">
          {ROWS.map((row, i) => (
            <PricingRow key={row.title} {...row} index={i} />
          ))}
        </div>
      </section>

      <PricingCTA />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pricing/PricingPage.jsx
git commit -m "feat: add PricingPage root with row data"
```

---

## Task 6: Tests

**Files:**
- Create: `client/src/pricing/PricingPage.test.jsx`

- [ ] **Step 1: Install React Testing Library**

`@testing-library/react` is not in the client's devDependencies — add it now:

```bash
cd client && npm install -D @testing-library/react @testing-library/jest-dom
```

Then confirm `vitest.config` has jsdom environment. Check `client/vite.config.js` or `client/vitest.config.js` for `environment: "jsdom"`. If the test block is absent, add it to `client/vite.config.js`:

```js
// inside defineConfig({...})
test: {
  environment: "jsdom",
},
```

- [ ] **Step 2: Write the tests**

```jsx
// client/src/pricing/PricingPage.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import PricingPage from "./PricingPage";
import PricingRow from "./PricingRow";
import { Monitor } from "lucide-react";

// Wrap with MemoryRouter because PricingNav uses <Link>
function renderPricingPage() {
  return render(
    <MemoryRouter>
      <PricingPage />
    </MemoryRouter>
  );
}

describe("PricingPage", () => {
  it("renders all three service rows", () => {
    renderPricingPage();
    expect(screen.getByText("Landing Page")).toBeDefined();
    expect(screen.getByText("Full Stack Application")).toBeDefined();
    expect(screen.getByText("Custom / Ongoing")).toBeDefined();
  });

  it("renders the back-to-portfolio link", () => {
    renderPricingPage();
    expect(screen.getByText("Back to portfolio")).toBeDefined();
  });

  it("renders the CTA button linking to email", () => {
    renderPricingPage();
    const link = screen.getByText("Get in Touch →").closest("a");
    expect(link.href).toContain("mailto:");
  });
});

describe("PricingRow", () => {
  function renderRow(overrides = {}) {
    return render(
      <PricingRow
        icon={Monitor}
        title="Test Service"
        price="$500"
        description="A test description."
        pills={["React", "Vite"]}
        {...overrides}
      />
    );
  }

  it("renders title, price, and description", () => {
    renderRow();
    expect(screen.getByText("Test Service")).toBeDefined();
    expect(screen.getByText("$500")).toBeDefined();
    expect(screen.getByText("A test description.")).toBeDefined();
  });

  it("renders tech pills", () => {
    renderRow();
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Vite")).toBeDefined();
  });

  it("shows 'Most Popular' badge when highlighted", () => {
    renderRow({ highlighted: true });
    expect(screen.getByText("Most Popular")).toBeDefined();
  });

  it("does not show 'Most Popular' badge when not highlighted", () => {
    renderRow({ highlighted: false });
    expect(screen.queryByText("Most Popular")).toBeNull();
  });

  it("renders no pills when pills array is empty", () => {
    renderRow({ pills: [] });
    expect(screen.queryByText("React")).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd client && npx vitest run src/pricing/PricingPage.test.jsx
```

Expected: all 8 tests pass (3 in PricingPage suite, 5 in PricingRow suite).

- [ ] **Step 4: Commit**

```bash
git add client/package.json client/package-lock.json client/vite.config.js client/src/pricing/PricingPage.test.jsx
git commit -m "test: add PricingPage and PricingRow render tests"
```

---

## Task 7: Register the route in App.jsx

**Files:**
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Add the import and route**

In `client/src/App.jsx`, add the import after the existing DrawPage import (line 23):

```jsx
import PricingPage from "./pricing/PricingPage";
```

Then add the route inside `<Routes>` after the `/draw` route (after line 76):

```jsx
<Route path="/pricing" element={<PricingPage />} />
```

The updated `App.jsx` relevant section looks like:

```jsx
import DrawPage from "./draw/DrawPage";
import PricingPage from "./pricing/PricingPage";   // ← add this
// ... rest of imports

// inside <Routes>:
<Route path="/draw" element={<DrawPage />} />
<Route path="/pricing" element={<PricingPage />} />  // ← add this

{/* Admin */}
```

- [ ] **Step 2: Run the dev server and verify**

```bash
cd /path/to/repo && npm run dev
```

Open `http://localhost:5173/pricing` in your browser. Verify:
- Slim navbar with `AB` monogram and "← Back to portfolio" link
- Hero headline with gold "worth shipping."
- Three pricing rows: Landing Page ($500), Full Stack Application (Starting $1,500 with "Most Popular" badge), Custom / Ongoing (dashed border, "Let's Talk")
- CTA banner at the bottom with "Get in Touch →" button
- Clicking "← Back to portfolio" navigates to `/`
- No link to `/pricing` appears anywhere in the main portfolio nav or footer
- Light mode toggle (in Footer on `/`) does NOT appear on this page — that's correct

- [ ] **Step 3: Run all tests**

```bash
cd client && npx vitest run
```

Expected: all existing tests pass + new pricing tests pass.

- [ ] **Step 4: Commit**

```bash
git add client/src/App.jsx
git commit -m "feat: register /pricing route"
```
