# Blog Integration Guide

Three files to drop into your portfolio, then three small edits.

---

## 1. Copy the blog files

Copy the entire `src/blog/` folder into your portfolio repo:

```
portfolio/src/blog/
  posts.js          ← data layer
  BlogIndex.jsx     ← listing page
  BlogPost.jsx      ← article page
```

---

## 2. Update `src/App.jsx`

Replace the current `App.jsx` with routing support:

```jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/css/index.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
import BlogIndex from "./blog/BlogIndex";
import BlogPost from "./blog/BlogPost";

function PortfolioHome() {
  return (
    <>
      <Header />
      <div id="home"><Hero /></div>
      <div id="skills"><Skills /></div>
      <div id="experience"><Experience /></div>
      <div id="education"><Education /></div>
      <div id="contact"><Contact /></div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Routes>
  );
}
```

> `main.jsx` already wraps with `<BrowserRouter>` — no changes needed there.

---

## 3. Add Blog link to `src/components/Header.jsx`

In the `navLinks` array (around line 42), add one entry:

```js
const navLinks = [
  { id: "skills",     label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education",  label: "Education" },
  { id: "contact",    label: "Contact" },
  { id: "blog",       label: "Blog", href: "/blog" }, // ← add this
];
```

Then in the nav render, handle the blog link differently (it's a page route, not a hash anchor):

```jsx
import { Link } from "react-router-dom";

// In the desktop nav map:
{navLinks.map(({ id, label, href }) =>
  href ? (
    <Link
      key={id}
      to={href}
      className="text-sm font-medium text-[#888888] hover:text-[#E8B84B] transition-colors"
    >
      {label}
    </Link>
  ) : (
    <HashLink
      key={id}
      to={`/#${id}`}
      smooth
      className={`text-sm font-medium transition-colors hover:text-[#E8B84B] ${
        activeSection === id ? "text-[#E8B84B]" : "text-[#888888]"
      }`}
    >
      {label}
    </HashLink>
  )
)}
```

---

## 4. Vercel config (already set up)

Your `vercel.json` likely has rewrites for client-side routing. Make sure `/blog` and `/blog/:slug` are covered:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This is the standard catch-all for Vite SPAs — if it's already there, you're good.

---

## 5. Adding real posts

Posts live in `src/blog/posts.js`. Each entry has:

```js
{
  slug: "my-post-slug",     // URL: /blog/my-post-slug
  title: "...",
  summary: "...",
  tags: ["React", "TypeScript"],
  date: "May 4, 2026",
  dateShort: "May 4",
  readTime: "5 min",
  featured: false,
  content: null,            // swap for MDX import when ready
}
```

When you're ready to write full post bodies, the recommended path is:

1. Install `@mdx-js/rollup` and add to `vite.config.js`
2. Create `src/blog/content/my-post-slug.mdx`
3. Import and pass as `content` prop to `BlogPost`
4. Render with `<MDXProvider>` and your existing code-block styles

---

## Done ✓

```
npm run dev
# Visit http://localhost:5173/blog
```
