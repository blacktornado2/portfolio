"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    const posts = [
        {
            slug: 'node-ts-api',
            title: 'Building Scalable REST APIs with Node.js and TypeScript',
            summary: 'Patterns, folder structure, and production-grade error handling for APIs that grow without becoming a mess.',
            tags: ['Node.js', 'TypeScript', 'Backend'],
            featured: true,
            readTime: '8 min read',
            publishedAt: new Date('2026-05-04'),
            body: `## Why TypeScript changes everything

When I first started writing Node.js APIs, I was all-in on plain JavaScript. It felt faster — no compilation step, no type annotations to maintain. But after a couple of production bugs that a type-checker would have caught instantly, I switched and never looked back.

TypeScript gives you something invaluable at scale: **a living contract**. Every function signature is documentation that the compiler enforces. Refactors stop being scary when you have 300 endpoints and a team of four.

> 💡 If you're starting a new project today, start with TypeScript from day one. Retrofitting types onto a large codebase is painful — trust me.

## Folder structure that actually scales

The most common mistake I see in Node APIs is a flat \`routes/\` folder with one giant file per resource. This works fine at 3 endpoints. At 30, it's chaos.

Here's the structure I've landed on after several production projects:

\`\`\`
src/
├── modules/
│   ├── users/
│   │   ├── users.router.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── users.types.ts
│   └── auth/
│       ├── auth.router.ts
│       └── auth.service.ts
├── shared/
│   ├── middleware/
│   ├── errors/
│   └── db/
└── app.ts
\`\`\`

The key insight: **each module owns its own types, service, and data access**. Nothing leaks out unless explicitly exported. This makes it trivially easy to find where any behaviour lives.

## Error handling done right

Express's default error handling is fine. But production apps need something more deliberate. The pattern I use is a typed \`AppError\` class combined with a single central error middleware.

\`\`\`typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Central middleware — add once, catches everything
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};
\`\`\`

### Async route wrappers

One of the most common Express gotchas: unhandled promise rejections inside async route handlers silently swallow errors. Wrap every handler:

\`\`\`typescript
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
\`\`\`

## Validation with Zod

Don't trust incoming request bodies. Ever. Zod is my go-to for runtime validation — it pairs perfectly with TypeScript because you get both a validator and an inferred type from a single schema definition.

\`\`\`typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['admin', 'user']).default('user'),
});

// Inferred type — no duplication!
type CreateUserDto = z.infer<typeof CreateUserSchema>;
\`\`\`

## Final thoughts

There's no single "correct" architecture for Node.js APIs — what matters is consistency and adaptability. The patterns above have held up across projects ranging from solo side-projects to multi-team codebases. Pick what works, document it, and stick to it.

In the next post, I'll cover database access patterns using Prisma and how to keep your repository layer testable without spinning up a real DB.`,
        },
        {
            slug: 'react-server-components',
            title: 'Server Components in Practice: What Actually Changes',
            summary: "After six months running RSC in production, here's what the mental model shift actually looks like day-to-day.",
            tags: ['React', 'Next.js', 'Frontend'],
            featured: false,
            readTime: '6 min read',
            publishedAt: new Date('2026-04-18'),
            body: `## The mental model shift nobody warns you about

The React Server Components documentation is thorough. What it can't fully prepare you for is the moment you try to reach for \`useState\` in a component that's now a Server Component, and everything blows up.

After six months of running RSC in production on a mid-sized Next.js app, here's what actually changed for me — and my team.

## What "server component" really means

A Server Component runs **once, on the server, at request time** (or build time for static pages). It has no event handlers, no state, no effects. What it does have: direct access to databases, file systems, and environment variables — no API layer needed.

\`\`\`tsx
// This runs on the server. No client JS shipped for this component.
async function UserProfile({ userId }: { userId: string }) {
  // Direct DB query — no useEffect, no loading state, no fetch
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) return <NotFound />;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

## The boundary problem

The trickiest part isn't using Server Components — it's deciding **where to draw the line** between server and client.

My rule of thumb after several rewrites: **push interactivity down as far as possible**. A page with a data table and a search input? The table is a Server Component. The search input and the logic that triggers re-fetching is a small Client Component that wraps the URL state.

\`\`\`tsx
// client component — handles only the input
'use client';
function SearchInput() {
  const router = useRouter();
  return (
    <input
      onChange={(e) => router.push(\`?q=\${e.target.value}\`)}
      placeholder="Search..."
    />
  );
}

// server component — reads search params, fetches data
async function ResultsTable({ searchParams }: { searchParams: { q?: string } }) {
  const results = await db.item.findMany({
    where: { name: { contains: searchParams.q } },
  });
  return <Table rows={results} />;
}
\`\`\`

## What actually got better

The two things I didn't expect to care about but now swear by:

**Waterfall elimination.** In the old world, a page component would fetch user data, then pass it to children, who would fetch their own data. Each dependent fetch added to the time-to-first-byte. With Server Components, sibling data fetches happen in parallel automatically.

**Zero client bundle for data-heavy components.** Our analytics dashboard went from 340kB of client JS to 12kB. The charts still render client-side, but all the data fetching, aggregation, and filtering logic never touches the browser.

## What's still awkward

Passing non-serialisable data across the server/client boundary. React will throw if you try to pass a function or a class instance as a prop to a Client Component from a Server Component. You have to serialise everything — which sometimes means restructuring your data model more than you'd like.

The mental overhead is real but it does get easier. Build a few small features this way and the model clicks.`,
        },
        {
            slug: 'zod-validation',
            title: 'Zod vs Yup vs Joi: Runtime Validation Compared',
            summary: 'A practical breakdown of the three most popular validation libraries in the Node.js ecosystem.',
            tags: ['TypeScript', 'Node.js'],
            featured: false,
            readTime: '5 min read',
            publishedAt: new Date('2026-03-30'),
            body: `## The problem with unvalidated input

Every bug I've traced back to "the API sent unexpected data" could have been caught at the boundary with a proper validation library. The question isn't *whether* to validate — it's *which* library to reach for.

Here's my honest take after using all three in production.

## Zod — TypeScript-first, my default pick

Zod is built for TypeScript. You define a schema once and get both a runtime validator and a compile-time type for free:

\`\`\`typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

type User = z.infer<typeof UserSchema>; // { name: string; email: string; age?: number }

const result = UserSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.flatten() });
}
// result.data is fully typed
\`\`\`

**Strengths:** TypeScript inference, \`safeParse\` never throws, excellent error messages, composable.

**Weaknesses:** Larger bundle size than Joi (matters for browser-side use).

## Yup — the React forms staple

Yup is the default choice when you're using Formik or React Hook Form. It has a similar chainable API to Zod but was designed before TypeScript-first APIs were common.

\`\`\`typescript
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

try {
  const validated = await schema.validate(data, { abortEarly: false });
} catch (err) {
  // err.errors is an array of strings
}
\`\`\`

**Strengths:** Mature, great Formik/RHF integration, async validation support.

**Weaknesses:** TypeScript types feel bolted on. \`validate\` throws by default (you have to remember \`abortEarly: false\` to get all errors at once).

## Joi — the OG, built for Node

Joi predates TypeScript and it shows — but it's battle-tested and expressive:

\`\`\`typescript
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const { error, value } = schema.validate(data);
\`\`\`

**Strengths:** Extremely comprehensive, mature ecosystem, Hapi.js integration.

**Weaknesses:** No TypeScript inference, verbose for simple cases, larger than alternatives.

## The verdict

| | Zod | Yup | Joi |
|---|---|---|---|
| TypeScript inference | ✅ Native | ⚠️ Bolted on | ❌ Manual |
| Bundle size | Medium | Small | Large |
| Error messages | Excellent | Good | Good |
| Best for | APIs, full-stack | Form validation | Legacy Node |

**Pick Zod** if you're on TypeScript and writing APIs. **Pick Yup** if you're deep in a React forms stack. **Use Joi** only if you're maintaining an existing codebase that already depends on it — there's no compelling reason to start a new project with it today.`,
        },
        {
            slug: 'react-native-perf',
            title: 'Diagnosing React Native Performance Issues',
            summary: 'The tools and techniques I use to find and fix jank in mobile apps — from Flipper to JS thread profiling.',
            tags: ['React Native', 'Mobile', 'Performance'],
            featured: false,
            readTime: '9 min read',
            publishedAt: new Date('2026-03-12'),
            body: `## Jank is a symptom, not a root cause

When a React Native app feels sluggish — stuttering animations, unresponsive taps, slow list scrolls — the instinct is to throw \`useMemo\` and \`useCallback\` everywhere and hope for the best. That rarely works and often makes things worse.

The right approach: **measure first, optimise second**. Here's my diagnostic workflow.

## The two threads you need to understand

React Native runs your JS on a separate thread from the UI. Most performance problems fall into one of two buckets:

1. **JS thread overload** — too much work on the JS thread, causing frame drops because UI updates can't be delivered in time.
2. **UI thread overload** — too many native view updates, shadow tree reconciliation, or GPU overdraw.

Knowing which thread is the bottleneck tells you where to look.

## Flipper — your first stop

Flipper's Performance plugin gives you a real-time graph of both thread frame rates. Open it, reproduce the jank, and look at the dip:

- Drop in JS thread FPS but UI thread is fine → expensive render or heavy computation in JS
- Drop in both threads → layout recalculation or too many views being redrawn

\`\`\`bash
# Make sure Flipper desktop app is running, then:
npx react-native start
# Connect your device/simulator — Flipper auto-discovers the Metro bundler
\`\`\`

## Profiling with the React DevTools Profiler

For JS-thread issues, the React DevTools Profiler (in the browser extension or Flipper's React DevTools plugin) shows exactly which components are re-rendering and how long each render takes.

Red bars = expensive. Look for components that re-render when their props haven't changed — that's a sign of missing memoization or a context that's too broad.

\`\`\`tsx
// Before: CartContext re-renders every consumer on any cart change
const CartContext = createContext<CartState>(null);

// After: split into data and dispatch contexts
const CartDataContext = createContext<CartItem[]>([]);
const CartDispatchContext = createContext<Dispatch<CartAction>>(null);
\`\`\`

## FlatList performance — the usual suspect

Nine times out of ten, list performance issues come down to a few FlatList misconfigurations:

\`\`\`tsx
<FlatList
  data={items}
  // Always provide this — prevents unnecessary re-renders
  keyExtractor={(item) => item.id.toString()}
  // Remove this in production — it adds a significant render cost
  // removeClippedSubviews={false}
  removeClippedSubviews={true}
  // Tune these for your item height
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  // Memoize the render function
  renderItem={renderItem}
  // Pass a stable reference for getItemLayout if items have fixed height
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
\`\`\`

The most impactful: **\`getItemLayout\`**. When React Native knows item heights upfront, it can skip measuring — this alone can halve scroll jank on long lists.

## Hermes and bytecode

If you're not running Hermes (React Native's optimised JS engine), enable it. It compiles JS to bytecode at build time, dramatically reducing startup time and memory usage.

In \`android/app/build.gradle\`:

\`\`\`groovy
project.ext.react = [
  enableHermes: true
]
\`\`\`

For iOS, it's enabled by default in React Native 0.70+.

## When JS profiling isn't enough

Some jank can't be fixed in JS. Heavy blur effects, many translucent layers, or complex shadow hierarchies cause GPU overdraw. On Android, enable "Show GPU Overdraw" in developer settings — solid red means four or more layers are being composited. Redesign those views.

The golden rule: **profile on a real device**. Simulator performance is not representative. A mid-range Android device from two years ago is your benchmark.`,
        },
        {
            slug: 'postgres-indexing',
            title: 'PostgreSQL Indexing: Beyond the Basics',
            summary: 'Partial indexes, covering indexes, and expression indexes — the features that actually make a difference at scale.',
            tags: ['PostgreSQL', 'Backend', 'Performance'],
            featured: false,
            readTime: '7 min read',
            publishedAt: new Date('2026-02-20'),
            body: `## Most indexes are wrong

Not technically wrong — they'll work. But a default B-tree index on a column is the lowest common denominator. PostgreSQL has a rich set of index types and options that most developers never touch. At scale, these are the features that move query times from seconds to milliseconds.

## Partial indexes — index less, win more

A partial index only covers rows that match a \`WHERE\` clause. If most queries filter on a subset of data, you can build an index that's a fraction of the full size and fits entirely in memory.

\`\`\`sql
-- Full index on a 10M-row table: 800MB, scans are slow
CREATE INDEX idx_orders_status ON orders(status);

-- Partial index on only pending orders: 2MB, much faster for the hot path
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';

-- Query that benefits:
SELECT * FROM orders
WHERE status = 'pending'
ORDER BY created_at
LIMIT 50;
\`\`\`

The query planner will use the partial index automatically when the query predicate matches the index condition.

## Covering indexes — eliminate the heap fetch

A regular index lookup has two steps: find the matching row IDs in the index, then fetch the actual rows from the heap (the table). A covering index stores additional columns inside the index itself, eliminating the heap fetch entirely.

\`\`\`sql
-- Without covering index: index scan + heap fetch for email and name
CREATE INDEX idx_users_id ON users(id);

-- With covering index: index-only scan, no heap access
CREATE INDEX idx_users_id_covering ON users(id) INCLUDE (email, name);

-- Now this query never touches the heap:
SELECT id, email, name FROM users WHERE id = $1;
\`\`\`

Use \`EXPLAIN (ANALYZE, BUFFERS)\` to confirm you're getting an "Index Only Scan" — if it says "Heap Fetches: 0", you've eliminated the heap access.

## Expression indexes — index computed values

If your queries filter on a function or expression, index the expression itself:

\`\`\`sql
-- Slow: full table scan because lower() isn't indexed
SELECT * FROM users WHERE lower(email) = 'user@example.com';

-- Create an expression index:
CREATE INDEX idx_users_email_lower ON users(lower(email));

-- Now this query uses the index:
SELECT * FROM users WHERE lower(email) = 'user@example.com';
\`\`\`

This is especially useful for case-insensitive lookups, JSON extraction, and date truncation.

## Reading EXPLAIN output

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;
\`\`\`

The key numbers to look at:

- **actual rows** vs **rows**: if PostgreSQL's estimate is wildly off, run \`ANALYZE orders\` to refresh statistics
- **Buffers: hit** vs **read**: cache hits are fast, disk reads are slow — a high read count means the index or table isn't in memory
- **actual time**: milliseconds for the node — anything over ~1ms per row for a simple lookup needs attention

## The index you don't need

Every index slows down writes. On a write-heavy table (event logs, audit trails, queues), an index you created for a one-time report can cause 20% slower inserts forever. Periodically check for unused indexes:

\`\`\`sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
\`\`\`

Zero scans since the last statistics reset means the index is probably safe to drop.`,
        },
        {
            slug: 'monorepo-turborepo',
            title: 'Taming a Monorepo with Turborepo',
            summary: 'How I restructured a fragmented multi-repo codebase into a clean Turborepo setup in a single sprint.',
            tags: ['Dev Tools', 'Monorepo', 'TypeScript'],
            featured: false,
            readTime: '6 min read',
            publishedAt: new Date('2026-02-05'),
            body: `## The multi-repo trap

It starts innocently. One repo for the frontend, one for the backend, one for shared types. Six months later you have twelve repos, three separate \`tsconfig.json\` setups that have drifted apart, shared utility code copy-pasted across five packages, and a CI pipeline that nobody fully understands.

This is exactly what I walked into on a client project. Here's how I consolidated it in a single sprint using Turborepo.

## Why Turborepo, not Nx?

Both are excellent. I chose Turborepo for this project because:

1. **Convention over configuration.** Turborepo infers most of the task graph from your \`package.json\` scripts.
2. **Incremental adoption.** You can layer it on top of an existing npm/yarn workspaces setup with minimal disruption.
3. **Remote caching.** Vercel's remote cache means CI builds that hit the cache are seconds, not minutes.

## The migration

### Step 1: flatten into a workspace

\`\`\`json
// root package.json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
\`\`\`

Move each repo into \`apps/\` or \`packages/\` depending on whether it's deployable or a shared library.

### Step 2: add turbo.json

\`\`\`json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}
\`\`\`

The \`"^build"\` means "build all dependencies first". Turborepo figures out the dependency graph from \`package.json\` imports automatically.

### Step 3: extract shared packages

This is the most valuable step. Identify code that's duplicated across repos and pull it into \`packages/\`:

\`\`\`
packages/
├── ui/          # shared React components
├── types/       # shared TypeScript types
├── config/      # shared ESLint, tsconfig, Tailwind configs
└── utils/       # shared utilities
\`\`\`

\`\`\`json
// apps/web/package.json
{
  "dependencies": {
    "@acme/ui": "*",
    "@acme/types": "*"
  }
}
\`\`\`

Workspace protocol (\`"*"\`) means npm always resolves to the local package, not the registry.

## The build speed difference

Before: full CI pipeline ~14 minutes. After enabling remote caching with no code changes: ~2 minutes on cache hit. The first run after a change only rebuilds the affected packages and their dependents — everything else uses the cache.

\`\`\`bash
# Check what Turborepo would run without executing
npx turbo build --dry-run

# The output shows which tasks are cached:
# Tasks: 12 successful, 12 total
# Cached: 10 cached, 12 total
# Time: 1.8s >>> FULL TURBO
\`\`\`

## What I'd do differently

Don't try to share *everything* through packages from day one. Start with types and configs — these have no runtime overhead. Add UI components and utilities once the structure is stable. Premature abstraction into shared packages creates coupling that's hard to undo.`,
        },
    ];
    for (const post of posts) {
        await prisma.post.create({ data: post });
    }
    console.log('✓ Database seeded with', posts.length, 'posts');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map