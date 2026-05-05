# Backend Design — Portfolio Blog

**Date:** 2026-05-04
**Status:** Approved

## Overview

Add a NestJS backend to the portfolio, restructure the repo into a `client/` + `server/` monorepo, migrate blog posts from static MDX files to a PostgreSQL database, and add anonymous likes (IP-deduplicated) and comments (live, admin-deletable) to blog posts.

---

## Decisions

| Question | Decision |
|---|---|
| Likes/comments auth | Anonymous — comments require name + email; likes are IP-deduplicated |
| Post management | Posts managed via admin API and stored in DB (MDX retired as runtime renderer) |
| Admin auth | Single admin user, username + bcrypt password, JWT (24h) |
| Comment moderation | Live immediately; admin can soft-delete via API |
| Monorepo approach | Simple two-package monorepo — no Turborepo tooling |
| Database | PostgreSQL via Neon (managed, free tier) |
| ORM | Prisma |
| Backend framework | NestJS |
| Frontend deploy | Vercel (unchanged) |
| Backend deploy | Railway |

---

## Repo Structure

```
portfolio/
├── client/                    ← existing frontend (all src/ + vite config moves here)
│   ├── src/
│   │   ├── blog/
│   │   ├── components/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                    ← new NestJS project
│   ├── src/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── likes/
│   │   ├── auth/
│   │   └── prisma/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── packages/
│   └── types/                 ← shared DTOs: PostDto, CommentDto, LikeDto
│       ├── index.ts
│       └── package.json       ← name: "@portfolio/types"
├── vercel.json                ← unchanged, SPA catch-all rewrite
└── package.json               ← npm workspaces: ["client","server","packages/*"]; root scripts: dev, dev:client, dev:server
```

---

## Database Schema (Prisma)

```prisma
model Post {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  title       String
  summary     String
  body        String    // markdown stored as string, rendered client-side
  tags        String[]
  featured    Boolean   @default(false)
  readTime    String
  publishedAt DateTime  @default(now())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  comments    Comment[]
  likes       Like[]
}

model Comment {
  id          Int      @id @default(autoincrement())
  postId      Int
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorName  String
  authorEmail String   // stored but never displayed publicly
  body        String
  createdAt   DateTime @default(now())
  deleted     Boolean  @default(false)
}

model Like {
  id        Int      @id @default(autoincrement())
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  ipHash    String   // SHA-256 of requester IP — raw IP never stored
  createdAt DateTime @default(now())

  @@unique([postId, ipHash])
}

// No Admin model — admin credentials live in env vars only.
// Auth service compares ADMIN_USERNAME and bcrypt.compare(password, ADMIN_PASSWORD_HASH) directly.
```

---

## API Endpoints

### Auth
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | `{ username, password }` → JWT |

### Posts
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/posts` | Public | Paginated list; supports `tag` and `page` query params |
| GET | `/posts/:slug` | Public | Single post with `likeCount` and `commentCount` |
| POST | `/posts` | JWT | Create post |
| PUT | `/posts/:slug` | JWT | Update post |
| DELETE | `/posts/:slug` | JWT | Delete post |

### Comments
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/posts/:slug/comments` | Public | All non-deleted comments for post |
| POST | `/posts/:slug/comments` | Public | `{ authorName, authorEmail, body }` — live immediately |
| DELETE | `/comments/:id` | JWT | Soft-delete (sets `deleted: true`) |

### Likes
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/posts/:slug/likes` | Public | `{ count, liked }` — `liked` reflects requesting IP |
| POST | `/posts/:slug/likes` | Public | Toggle like; idempotent |

---

## NestJS Conventions

- **Validation:** `class-validator` + `ValidationPipe` (global) on all DTOs
- **Rate limiting:** `@nestjs/throttler` — 10 req/min on `POST /comments`, 30 req/min on `POST /likes`
- **CORS:** `CLIENT_URL` env var (Vercel origin in prod, `http://localhost:5173` in dev)
- **Pagination:** cursor-based on posts list

---

## Frontend Changes

### Data fetching
`src/blog/posts.js` static array is replaced by API calls via a thin `api.js` module using `VITE_API_URL`. No third-party data-fetching library — plain `fetch` + `useEffect`.

### BlogPost additions
Two new UI sections below the article body, above Related Posts:
1. **Like button** — heart icon with count, filled state if current IP has liked. Optimistic update on click.
2. **Comments section** — list of comments + submission form (`authorName`, `authorEmail`, `body`).

### Admin routes
New protected route group at `/admin`:
- `/admin` — post list with Create / Edit / Delete actions
- `/admin/posts/new` — markdown textarea + metadata form
- `/admin/posts/:slug/edit` — same form pre-populated
- `/admin/comments` — full comment list with soft-delete per row

Login form at `/admin` issues a JWT stored in `localStorage`. `JwtAuthGuard` on all admin API endpoints.

### MDX retirement
- Remove `@mdx-js/rollup`, `@mdx-js/react`, `rehype-slug` from `client/`
- Replace `MDXProvider` in `BlogPost.jsx` with `react-markdown` + `remark-gfm`
- Existing `node-ts-api.mdx` content becomes the first DB seed record

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Set `Root Directory: client/` in project settings; add `VITE_API_URL` env var |
| Backend | Railway | Points to `server/`; runs `prisma migrate deploy && node dist/main` |
| Database | Neon (PostgreSQL) | `DATABASE_URL` injected into Railway env |

### Environment variables

**`server/` (Railway + local `.env`)**
```
DATABASE_URL=
JWT_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=   # bcrypt hash of the admin password
CLIENT_URL=            # https://yourdomain.vercel.app in prod
```

**`client/` (Vercel + local `.env`)**
```
VITE_API_URL=          # https://your-app.railway.app in prod; http://localhost:3001 in dev
```

### Local dev
```bash
# From repo root
npm run dev             # runs both client and server concurrently
npm run dev:client      # cd client && npm run dev
npm run dev:server      # cd server && npm run start:dev
```

---

## Migration path for existing MDX posts

The six posts currently defined in `src/blog/posts.js` (and `node-ts-api.mdx`) are inserted as a Prisma seed script (`server/prisma/seed.ts`) during initial setup. Subsequent posts are created exclusively through the admin API.
