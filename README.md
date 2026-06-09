# Portfolio — Ankit Bhardwaj

A personal portfolio built with React 18 + Vite on the frontend and NestJS + Prisma on the backend. Single-page design with anchor navigation, plus separate routes for a blog and a games section.

🔗 **Live site:** [bhardwajankit.com](https://bhardwajankit.com)

---

## Screenshots

**Hero**

![Hero section](.github/assets/Hero%20Section.png)

**Skills**

![Skills section](.github/assets/Skills.png)

---

## Tech Stack

### Frontend (`client/`)

| Layer | Tools |
|---|---|
| Framework | React 18, Vite 6 |
| Routing | React Router v7, react-router-hash-link |
| Styling | Tailwind CSS v3, shadcn/ui (Radix primitives) |
| Animation | Framer Motion v11 |
| Syntax highlighting | Prism.js |
| Icons | react-icons, lucide-react |
| Blog rendering | react-markdown, remark-gfm |
| Forms | Web3Forms (client-side, no backend required) |
| Deployment | Vercel |

### Backend (`server/`)

| Layer | Tools |
|---|---|
| Framework | NestJS v10 |
| ORM | Prisma |
| Auth | JWT (passport-jwt) |
| Language | TypeScript |

---

## Sections & Routes

| Route | Description |
|---|---|
| `/` `#home` | 01 — Hero: intro, availability badge, syntax-highlighted code window |
| `/` `#experience` | 02 — Professional Journey: experience cards |
| `/` `#projects` | 03 — Projects: project cards with preview images |
| `/` `#blog` | 04 — Dev Notes: 3 latest posts preview, CTA to /blog |
| `/` `#games` | 05 — Side Quests: 3 game cards (2048, Wordle, TypeRacer) |
| `/` `#skills` | 06 — Skills: icon cloud + skill category cards |
| `/` `#testimonials` | 07 — Testimonials: infinite marquee (not in navbar) |
| `/` `#contact` | 08 — Contact: info panel + Web3Forms contact form |
| `/blog` | Blog index — search, tag filters, grid/list toggle |
| `/blog/:slug` | Individual blog post — react-markdown, comments, likes |
| `/games` | Games hub |
| `/games/2048` | 2048 |
| `/games/wordle` | Wordle |
| `/games/typeracer` | TypeRacer |
| `/draw` | Canvas drawing tool |

---

## Projects

| Project | Stack | Links |
|---|---|---|
| [Vitano](https://www.vitano.in) | React, TypeScript, Tailwind CSS | [GitHub](https://github.com/blacktornado2/vitano) · [Live](https://www.vitano.in) |
| DevTrack | React, TypeScript, Node.js, PostgreSQL, Socket.io | — |
| ShopFlow | React Native, Node.js, MongoDB, Stripe, Firebase | — |

Project cards support an optional `image` field — set it to an imported asset to show a preview thumbnail at the top of the card.

---

## Project Structure

```
portfolio/                          # Monorepo root
├── client/                         # React frontend
│   ├── src/
│   │   ├── App.jsx                 # All routes
│   │   ├── main.jsx
│   │   ├── assets/
│   │   │   ├── css/index.css       # Design tokens, fonts, Prism theme
│   │   │   └── images/
│   │   │       ├── Ankit-3D.png    # AI-generated profile photo (About section)
│   │   │       ├── vitano-preview.png  # Vitano project card thumbnail
│   │   │       └── logo.png
│   │   ├── blog/
│   │   │   ├── BlogIndex.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── posts.js
│   │   │   └── content/            # Markdown articles
│   │   ├── components/
│   │   │   ├── Header.jsx          # Fixed nav + scroll progress bar (⌘K palette)
│   │   │   ├── Hero.jsx            # 01 — Hero + availability badge
│   │   │   ├── PortfolioPage.jsx   # About — rendered inside Hero
│   │   │   ├── Experience.jsx      # 02 — Professional Journey
│   │   │   ├── Projects.jsx        # 03 — Projects
│   │   │   ├── FieldNotesSection.jsx  # 04 — Dev Notes (fetches API)
│   │   │   ├── SideQuestsSection.jsx  # 05 — Side Quests (static)
│   │   │   ├── Skills.jsx          # 06 — Skills
│   │   │   ├── TestimonialsSection.jsx  # 07 — Testimonials (marquee)
│   │   │   ├── Contact.jsx         # 08 — Contact
│   │   │   ├── Footer.jsx          # Global footer (/, /blog, /games)
│   │   │   ├── CommandPalette.jsx  # ⌘K search
│   │   │   ├── GoldenCursor.jsx
│   │   │   ├── globe.jsx
│   │   │   └── ui/                 # shadcn/ui primitives — read-only
│   │   ├── games/
│   │   │   ├── GamesIndex.jsx
│   │   │   ├── Game2048.jsx
│   │   │   ├── GameWordle.jsx
│   │   │   └── GameTyperacer.jsx
│   │   ├── draw/
│   │   │   └── DrawPage.jsx
│   │   ├── constants/index.js      # Email, location, pincode, GitHub URL, LinkedIn URL
│   │   └── lib/utils.js            # cn() — Tailwind class merger
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                         # NestJS backend
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── likes/
│   │   └── prisma/
│   ├── prisma/
│   └── tsconfig.json
├── docs/
│   └── superpowers/                # Design spec & implementation plan
└── vercel.json
```

---

## Design System

Defined in `client/src/assets/css/index.css`:

- Background `#111111` · Surface `#1A1A1A` · Border `#2A2A2A`
- Gold accent `#E8B84B` · Secondary text `#888888`
- Headings: `font-syne font-bold text-4xl lg:text-5xl`
- Section numbering: `01 — About Me` … `08 — Contact` (gold number, em-dash, white name)

---

## Getting Started

**Prerequisites:** Node.js 18+ and Git.

```bash
git clone https://github.com/blacktornado2/portfolio.git
cd portfolio
```

### Frontend

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd server
npm install
npx prisma generate
npm run start:dev  # http://localhost:3000
```

### Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Customization

- **Personal info** (email, location, pincode, GitHub URL, LinkedIn URL) — edit `client/src/constants/index.js`
- **Web3Forms key** — edit `client/src/components/Contact.jsx` (only remaining hardcoded value)
- **Skills, experience** — edit the data arrays at the top of each section component
- **Projects** — add an entry to the `projects` array in `Projects.jsx`; include an `image` import for a card thumbnail
- **Blog posts** — add a Markdown file to `client/src/blog/content/` and register it in `client/src/blog/posts.js`

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">Made with ❤️ by <a href="https://github.com/blacktornado2">Ankit Bhardwaj</a></div>
