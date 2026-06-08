# Portfolio — Claude Context

## Purpose
Ankit Bhardwaj's personal portfolio + blog. Target audience: recruiters and freelancing clients.
The portfolio is a single scrollable page (anchor-link navigation); the blog, games, and draw tool are separate routes backed by an API.

## Monorepo Layout
npm workspaces — three packages under the repo root:

| Workspace | Purpose |
|---|---|
| `client/` | React 18 + Vite 6 frontend (portfolio, blog, games, draw) |
| `server/` | NestJS 10 + Prisma API (blog posts, comments, likes, auth) |
| `packages/*` | Shared packages (if any) |

Root scripts run both halves together via `concurrently`.

## Tech Stack

### Client (`client/`)
- **React 18** + **Vite 6** (ESM, `@` alias → `client/src/`)
- **React Router DOM v7** — route-based pages; **react-router-hash-link** for smooth-scroll anchors
- **Tailwind CSS v3** — utility-first, no CSS modules
- **Framer Motion v11** — all animations
- **react-markdown** + **remark-gfm** — blog post rendering
- **Prism.js** — syntax highlighting in the Hero code window
- **shadcn/ui** primitives (Radix UI) — in `client/src/components/ui/`, treat as read-only vendor code
- **Vitest** — unit tests (draw tooling has coverage)
- **Web3Forms** — contact form submission (client-side)

### Server (`server/`)
- **NestJS 10** (Node) — modules: `posts`, `comments`, `likes`, `auth`
- **Prisma 6** ORM — schema at `server/prisma/schema.prisma`
- **PostgreSQL** (Neon, serverless) — `DATABASE_URL` needs `?sslmode=require`
- **JWT + Passport** — single admin user for write access
- **bcrypt** — admin password hashing

## Key Directories

| Path | Purpose |
|---|---|
| `client/src/components/` | One file per portfolio section + `globe.jsx` (icon cloud wrapper) |
| `client/src/components/ui/` | shadcn/ui primitives — read-only vendor code |
| `client/src/blog/` | Blog index, post view, markdown content |
| `client/src/games/` | Games index + individual games (2048, Wordle, Typeracer) |
| `client/src/draw/` | Canvas draw tool + Vitest specs |
| `client/src/lib/api.ts` | API client — reads `VITE_API_URL`, injects JWT from localStorage |
| `client/src/lib/utils.js` | `cn()` helper — Tailwind class merge (clsx + tailwind-merge) |
| `client/src/assets/css/index.css` | Design tokens, Google Fonts, Prism theme, shadcn CSS vars |
| `client/src/constants/index.js` | Personal data (email, location, pincode) — edit here, not in components |
| `client/tailwind.config.js` | Font families + shadcn color tokens |
| `server/src/` | NestJS modules (one folder per feature) |
| `server/prisma/` | Prisma schema, migrations, seed |
| `docs/design-system.md` | Full "Dark Refined" design system — patterns, tokens, API reference |
| `docs/superpowers/` | Historical design specs + implementation plans (point-in-time, do not rewrite) |

## Routes (`client/src/App.jsx`)

```
/ (portfolio SPA)   home → skills → experience → projects → contact
                    About (01) renders inside Hero.jsx via PortfolioPage.jsx
/blog               BlogIndex — search, tag filters, grid/list toggle
/blog/:slug         BlogPost — full post + comments + likes
/games              GamesIndex
/games/2048         Game2048
/games/wordle       GameWordle
/games/typeracer    GameTyperacer
/draw               DrawPage — canvas drawing tool
```

> Note: `Education.jsx` exists in `components/` but is **orphaned** — the live render tree uses `Projects.jsx` at section 04. Don't reintroduce Education without intent.

## API Endpoints (`server/`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/posts` | — | Paginated, optional `?tag=` filter |
| `GET` | `/posts/:slug` | — | Single post |
| `POST` `PUT` `DELETE` | `/posts` `/posts/:slug` | JWT | Create / update / delete post |
| `GET` `POST` | `/posts/:slug/comments` | — | List / add comments |
| `DELETE` | `/comments/:id` | JWT | Delete comment |
| `GET` `POST` | `/posts/:slug/likes` | — | Like count / toggle like (IP-hash based) |
| `POST` | `/auth/login` | — | Returns `accessToken` JWT |

## Build & Dev Commands

```
# Root (runs both workspaces)
npm run dev            # client (Vite :5173) + server (Nest :3001) via concurrently
npm run build          # build all workspaces
npm run lint           # lint all workspaces

# Server-specific (cd server)
npm run start:dev      # ts-node dev server
npm run prisma:migrate # apply migrations (dev)
npm run prisma:seed    # seed the database
npx prisma migrate deploy   # apply migrations (production)
```

## Deployment

| Layer | Host | Notes |
|---|---|---|
| Client | **Vercel** | Set `VITE_API_URL` to the Render API URL; redeploy after changing env vars |
| Server | **Render** (free tier) | Docker deploy from `server/Dockerfile`; cold starts after 15min idle |
| Database | **Neon** | Serverless Postgres; `DATABASE_URL` with `?sslmode=require` |

**CORS:** `server/src/main.ts` allows a comma-separated list of origins from `CLIENT_URL`. `www.` and non-`www.` are distinct origins — include both. Custom domain: `bhardwajankit.com`.

## Environment Variables

Server (`.env`): `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt), `CLIENT_URL` (comma-separated origins), `PORT`.
Client: `VITE_API_URL`.
See `.env.example` at the repo root for the full template.

## Design System (Dark Refined)
Tokens defined in `client/src/assets/css/index.css`. Full reference in `docs/design-system.md`. Core:
- Background `#111111` · Surface `#1A1A1A` · Border `#2A2A2A`
- Gold accent `#E8B84B` · Secondary text `#888888`
- Section headings: `font-syne font-bold text-4xl lg:text-5xl`
- Section numbering: `01 — About Me`, `02 — Skills`, … (gold number, em-dash, white name)

## Personal Data
Edit `client/src/constants/index.js` for email, location, pincode.
Hard-coded values (GitHub URL, LinkedIn URL, Web3Forms key) live in `client/src/components/Contact.jsx`.

## Additional Documentation
- **[docs/design-system.md](docs/design-system.md)** — Complete design system: color, typography, component patterns (incl. blog), animation, backend stack, API reference. Read before adding UI.
- **[.claude/docs/architectural_patterns.md](.claude/docs/architectural_patterns.md)** — Animation constants, card conventions, data-driven sections, form handling. Read before editing portfolio section components. (Note: some line references predate the monorepo move to `client/src/`.)
