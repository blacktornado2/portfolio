// src/blog/posts.js
// Central data store for blog posts.
// When you're ready to move to MDX / a CMS, replace this array
// with your data-fetching logic and keep the same shape.

export const POSTS = [
  {
    id: 1,
    slug: "node-ts-api",
    title: "Building Scalable REST APIs with Node.js and TypeScript",
    summary:
      "Patterns, folder structure, and production-grade error handling for APIs that grow without becoming a mess.",
    tags: ["Node.js", "TypeScript", "Backend"],
    date: "May 4, 2026",
    dateShort: "May 4",
    readTime: "8 min",
    featured: true,
    content: null, // replace with imported MDX or a content string
  },
  {
    id: 2,
    slug: "react-server-components",
    title: "Server Components in Practice: What Actually Changes",
    summary:
      "After six months running RSC in production, here's what the mental model shift actually looks like day-to-day.",
    tags: ["React", "Next.js", "Frontend"],
    date: "Apr 18, 2026",
    dateShort: "Apr 18",
    readTime: "6 min",
    featured: false,
    content: null,
  },
  {
    id: 3,
    slug: "zod-validation",
    title: "Zod vs Yup vs Joi: Runtime Validation Compared",
    summary:
      "A practical breakdown of the three most popular validation libraries in the Node.js ecosystem.",
    tags: ["TypeScript", "Node.js"],
    date: "Mar 30, 2026",
    dateShort: "Mar 30",
    readTime: "5 min",
    featured: false,
    content: null,
  },
  {
    id: 4,
    slug: "react-native-perf",
    title: "Diagnosing React Native Performance Issues",
    summary:
      "The tools and techniques I use to find and fix jank in mobile apps — from Flipper to JS thread profiling.",
    tags: ["React Native", "Mobile", "Performance"],
    date: "Mar 12, 2026",
    dateShort: "Mar 12",
    readTime: "9 min",
    featured: false,
    content: null,
  },
  {
    id: 5,
    slug: "postgres-indexing",
    title: "PostgreSQL Indexing: Beyond the Basics",
    summary:
      "Partial indexes, covering indexes, and expression indexes — the features that actually make a difference at scale.",
    tags: ["PostgreSQL", "Backend", "Performance"],
    date: "Feb 20, 2026",
    dateShort: "Feb 20",
    readTime: "7 min",
    featured: false,
    content: null,
  },
  {
    id: 6,
    slug: "monorepo-turborepo",
    title: "Taming a Monorepo with Turborepo",
    summary:
      "How I restructured a fragmented multi-repo codebase into a clean Turborepo setup in a single sprint.",
    tags: ["Dev Tools", "Monorepo", "TypeScript"],
    date: "Feb 5, 2026",
    dateShort: "Feb 5",
    readTime: "6 min",
    featured: false,
    content: null,
  },
];

export const ALL_TAGS = [
  "All",
  ...Array.from(new Set(POSTS.flatMap((p) => p.tags))),
];

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(post, count = 2) {
  return POSTS.filter(
    (p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))
  ).slice(0, count);
}
