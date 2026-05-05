# Games Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Games section to the portfolio — a `/games` lobby page and three individual game pages (`/games/2048`, `/games/wordle`, `/games/typeracer`) — wired into the header nav.

**Architecture:** Each game is a React component (C-2 hybrid): JSX renders the HTML structure, a single `useEffect(fn, [])` injects game-specific CSS and runs the original vanilla JS game logic using `document.getElementById`, and the cleanup function removes event listeners and the injected `<style>`. GamesIndex is pure React + Tailwind (no vanilla JS).

**Tech Stack:** React 18, React Router v6 (`Link`), Tailwind CSS v3, vanilla JS (game logic unchanged)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `client/src/App.jsx` | Add 4 new routes |
| Modify | `client/src/components/Header.jsx` | Add Games nav link |
| Create | `client/src/games/GamesIndex.jsx` | `/games` lobby — game card grid, pure React |
| Create | `client/src/games/Game2048.jsx` | `/games/2048` — 2048 game, C-2 hybrid |
| Create | `client/src/games/GameWordle.jsx` | `/games/wordle` — Wordle game, C-2 hybrid |
| Create | `client/src/games/GameTyperacer.jsx` | `/games/typeracer` — Type Racer game, C-2 hybrid |

---

## Task 1: Wire routes and add header link

**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/components/Header.jsx`

- [ ] **Step 1: Add Games link to `navLinks` in `Header.jsx`**

In `client/src/components/Header.jsx`, find the `navLinks` array (line 53) and add the Games entry:

```js
const navLinks = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "games", label: "Games", href: "/games" },
];
```

- [ ] **Step 2: Add 4 routes to `App.jsx`**

Replace the contents of `client/src/App.jsx` with:

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
import GamesIndex from "./games/GamesIndex";
import Game2048 from "./games/Game2048";
import GameWordle from "./games/GameWordle";
import GameTyperacer from "./games/GameTyperacer";

function PortfolioHome() {
  return (
    <>
      <Header />
      <div id="home">
        <Hero />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="education">
        <Education />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/games" element={<GamesIndex />} />
      <Route path="/games/2048" element={<Game2048 />} />
      <Route path="/games/wordle" element={<GameWordle />} />
      <Route path="/games/typeracer" element={<GameTyperacer />} />
    </Routes>
  );
}
```

- [ ] **Step 3: Create stub files so the app compiles**

Create `client/src/games/GamesIndex.jsx`:
```jsx
export default function GamesIndex() { return <div>Games</div>; }
```

Create `client/src/games/Game2048.jsx`:
```jsx
export default function Game2048() { return <div>2048</div>; }
```

Create `client/src/games/GameWordle.jsx`:
```jsx
export default function GameWordle() { return <div>Wordle</div>; }
```

Create `client/src/games/GameTyperacer.jsx`:
```jsx
export default function GameTyperacer() { return <div>TypeRacer</div>; }
```

- [ ] **Step 4: Verify the app builds and header shows "Games"**

```bash
cd client && npm run dev
```

Open http://localhost:5173 — confirm "Games" appears in the header nav. Click it — confirm it navigates to `/games` and shows "Games". Check mobile drawer too.

- [ ] **Step 5: Commit**

```bash
git add client/src/App.jsx client/src/components/Header.jsx client/src/games/
git commit -m "feat: wire games routes and header nav link"
```

---

## Task 2: Create GamesIndex.jsx (the lobby)

**Files:**
- Create: `client/src/games/GamesIndex.jsx`

- [ ] **Step 1: Replace the stub with the full lobby component**

Replace `client/src/games/GamesIndex.jsx` with:

```jsx
import React from "react";
import { Link } from "react-router-dom";

function GameCard({ href, tag, title, description, preview, previewBg }) {
  return (
    <Link
      to={href}
      className="group block bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden no-underline transition-all duration-200 hover:border-[#E8B84B] hover:-translate-y-0.5"
    >
      <div
        className="h-[180px] flex items-center justify-content-center justify-center overflow-hidden"
        style={{ background: previewBg }}
      >
        <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          {preview}
        </div>
      </div>
      <div className="p-6">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B] inline-block mb-2.5">
          {tag}
        </span>
        <h2 className="font-syne font-bold text-xl text-white mb-2 tracking-tight group-hover:text-[#E8B84B] transition-colors duration-150">
          {title}
        </h2>
        <p className="text-sm text-[#888888] leading-relaxed mb-4">{description}</p>
        <span className="font-mono text-xs text-[#E8B84B] group-hover:tracking-wider transition-all duration-150">
          Play now →
        </span>
      </div>
    </Link>
  );
}

const GAMES = [
  {
    href: "/games/typeracer",
    tag: "Dev-themed",
    title: "Type Racer",
    description:
      "Race against time typing real code snippets. The faster and more accurate you type, the higher your WPM score.",
    previewBg: "linear-gradient(135deg, #1A1A1A 0%, #161616 100%)",
    preview: (
      <svg width="200" height="100" viewBox="0 0 200 100">
        <rect x="10" y="38" width="80" height="10" rx="2" fill="#2A2A2A" />
        <rect x="10" y="38" width="55" height="10" rx="2" fill="#E8B84B" opacity="0.8" />
        <rect x="10" y="54" width="180" height="8" rx="2" fill="#222" />
        <rect x="10" y="66" width="130" height="8" rx="2" fill="#222" />
        <text x="10" y="30" fontFamily="JetBrains Mono" fontSize="11" fill="#555">
          const dev = &apos;ankit&apos;
        </text>
        <rect x="68" y="25" width="1.5" height="13" fill="#E8B84B" opacity="0.9">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
  },
  {
    href: "/games/2048",
    tag: "Puzzle",
    title: "2048",
    description:
      "Slide and merge numbered tiles to reach 2048. Simple rules, infinite depth. How far can you go?",
    previewBg: "linear-gradient(135deg, #1A1A1A 0%, #161616 100%)",
    preview: (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <rect x="5" y="5" width="52" height="52" rx="4" fill="#2A2A2A" />
        <rect x="63" y="5" width="52" height="52" rx="4" fill="#3A2E10" />
        <rect x="5" y="63" width="52" height="52" rx="4" fill="#2A1F00" />
        <rect x="63" y="63" width="52" height="52" rx="4" fill="#E8B84B" />
        <text x="89" y="35" fontFamily="Syne,sans-serif" fontSize="18" fontWeight="800" fill="#E8B84B" textAnchor="middle">64</text>
        <text x="31" y="35" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="700" fill="#888" textAnchor="middle">16</text>
        <text x="31" y="93" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="700" fill="#E8B84B" opacity="0.6" textAnchor="middle">32</text>
        <text x="89" y="93" fontFamily="Syne,sans-serif" fontSize="22" fontWeight="800" fill="#111" textAnchor="middle">2048</text>
      </svg>
    ),
  },
  {
    href: "/games/wordle",
    tag: "Word",
    title: "Wordle",
    description:
      "Guess the hidden 5-letter word in 6 tries. Green means correct, yellow means wrong position.",
    previewBg: "linear-gradient(135deg, #1A1A1A 0%, #161616 100%)",
    preview: (
      <svg width="180" height="100" viewBox="0 0 180 100">
        <rect x="10" y="10" width="28" height="28" rx="3" fill="#22C55E" opacity="0.8" />
        <rect x="44" y="10" width="28" height="28" rx="3" fill="#22C55E" opacity="0.8" />
        <rect x="78" y="10" width="28" height="28" rx="3" fill="#22C55E" opacity="0.8" />
        <rect x="112" y="10" width="28" height="28" rx="3" fill="#22C55E" opacity="0.8" />
        <rect x="146" y="10" width="28" height="28" rx="3" fill="#22C55E" opacity="0.8" />
        <text x="24" y="30" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">C</text>
        <text x="58" y="30" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">O</text>
        <text x="92" y="30" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">D</text>
        <text x="126" y="30" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">E</text>
        <text x="160" y="30" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">D</text>
        <rect x="10" y="44" width="28" height="28" rx="3" fill="#E8B84B" opacity="0.7" />
        <rect x="44" y="44" width="28" height="28" rx="3" fill="#2A2A2A" />
        <rect x="78" y="44" width="28" height="28" rx="3" fill="#2A2A2A" />
        <rect x="112" y="44" width="28" height="28" rx="3" fill="#E8B84B" opacity="0.7" />
        <rect x="146" y="44" width="28" height="28" rx="3" fill="#2A2A2A" />
        <text x="24" y="64" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">B</text>
        <text x="58" y="64" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="#555" textAnchor="middle">A</text>
        <text x="92" y="64" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="#555" textAnchor="middle">K</text>
        <text x="126" y="64" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="white" textAnchor="middle">E</text>
        <text x="160" y="64" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="800" fill="#555" textAnchor="middle">D</text>
      </svg>
    ),
  },
];

export default function GamesIndex() {
  return (
    <main className="bg-[#111111] min-h-screen text-white">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Switch back to portfolio
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#555555] mb-3">
            Mini Games
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(32px,6vw,52px)] leading-[1.1] tracking-[-0.04em] mb-4">
            Play something.<br />
            <span className="text-[#E8B84B]">Take a break.</span>
          </h1>
          <p className="text-base text-[#888888] max-w-md leading-relaxed">
            A few games built entirely in the browser — no installs, no accounts. Just pure JavaScript fun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify lobby in browser**

Run `npm run dev` in `client/`. Navigate to http://localhost:5173/games.

Confirm:
- Sticky back-to-portfolio header with arrow link
- Page heading renders with gold "Take a break."
- Three game cards in a responsive grid
- Hover over a card — border turns gold, card lifts slightly, preview opacity increases
- Clicking a card navigates to the stub route (e.g. `/games/2048` shows "2048")

- [ ] **Step 3: Commit**

```bash
git add client/src/games/GamesIndex.jsx
git commit -m "feat: add games lobby page (GamesIndex)"
```

---

## Task 3: Create Game2048.jsx

**Files:**
- Create: `client/src/games/Game2048.jsx`

- [ ] **Step 1: Replace the stub with the full component**

Replace `client/src/games/Game2048.jsx` with:

```jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg:#111111;--bg2:#1A1A1A;--border:#2A2A2A;--text:#fff;--muted:#888;--muted2:#555;--accent:#E8B84B; }
  html,body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;user-select:none;}
  header{position:sticky;top:0;z-index:50;background:rgba(17,17,17,0.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);}
  .g-header-inner{max-width:520px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;}
  .g-logo{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;color:var(--text);text-decoration:none;letter-spacing:-0.02em;}
  .g-logo span{color:var(--accent);}
  .g-back{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);text-decoration:none;transition:color 0.15s;}
  .g-back:hover{color:var(--accent);}
  main{max-width:520px;margin:0 auto;padding:40px 24px 80px;}
  .top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .top-bar h1{font-family:'Syne',sans-serif;font-weight:800;font-size:40px;letter-spacing:-0.04em;color:var(--accent);}
  .scores{display:flex;gap:10px;}
  .score-box{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:8px 16px;text-align:center;min-width:72px;}
  .score-label{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted2);margin-bottom:2px;}
  .score-val{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;color:var(--text);}
  .controls{display:flex;gap:8px;margin-bottom:16px;}
  .btn{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:8px 20px;border-radius:8px;cursor:pointer;border:none;transition:all 0.15s;}
  .btn-primary{background:var(--accent);color:#111;}
  .btn-primary:hover{background:#d4a83e;}
  .btn-secondary{background:var(--bg2);color:var(--muted);border:1px solid var(--border);}
  .btn-secondary:hover{border-color:var(--accent);color:var(--accent);}
  .hint{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted2);margin-bottom:16px;}
  .board-wrap{position:relative;}
  .board{background:#1A1A1A;border:1px solid var(--border);border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;aspect-ratio:1;}
  .cell{border-radius:6px;background:#222;border:1px solid #2A2A2A;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;aspect-ratio:1;transition:all 0.1s ease;position:relative;overflow:hidden;}
  .cell-inner{font-size:clamp(14px,3.5vw,28px);line-height:1;}
  .t2{background:#2A2A2A;color:#ccc;border-color:#333;}
  .t4{background:#3A2E10;color:#E8B84B;border-color:#4A3A14;}
  .t8{background:#5C3A00;color:#FFD080;border-color:#7A4D00;}
  .t16{background:#7A2C00;color:#FFA060;border-color:#992E00;}
  .t32{background:#8B1E1E;color:#FFB0B0;border-color:#AA2222;}
  .t64{background:#6B1515;color:#FF8888;border-color:#881818;}
  .t128{background:#1E5C1E;color:#88FF88;border-color:#227722;}
  .t256{background:#1A4D1A;color:#66FF66;border-color:#1E601E;}
  .t512{background:#0F3C4A;color:#66EEFF;border-color:#125560;}
  .t1024{background:#0A2A38;color:#44DDFF;border-color:#0E3F55;}
  .t2048{background:#E8B84B;color:#111;border-color:#FFD080;}
  .tbig{background:#CC44CC;color:#fff;border-color:#DD66DD;}
  .overlay{position:absolute;inset:0;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;z-index:10;background:rgba(17,17,17,0.88);backdrop-filter:blur(4px);}
  .overlay.hidden{display:none;}
  .overlay-title{font-family:'Syne',sans-serif;font-weight:800;font-size:32px;letter-spacing:-0.03em;}
  .overlay-score{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--muted);}
  @media(max-width:500px){.hint::after{content:" · Swipe to move on mobile";}}
`;

export default function Game2048() {
  useEffect(() => {
    document.title = "2048 — Ankit Bhardwaj";
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const SIZE = 4;
    let grid = [], score = 0, best = 0, prevGrid = null, prevScore = 0;

    best = parseInt(localStorage.getItem("2048-best") || "0");
    document.getElementById("best").textContent = best;

    function empty() {
      return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    }

    function addRandom(g) {
      const cells = [];
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (g[r][c] === 0) cells.push([r, c]);
      if (!cells.length) return;
      const [r, c] = cells[Math.floor(Math.random() * cells.length)];
      g[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function newGame() {
      grid = empty(); score = 0;
      addRandom(grid); addRandom(grid);
      prevGrid = null;
      render();
      document.getElementById("overlay").classList.add("hidden");
    }

    function slideRow(row) {
      const filtered = row.filter((v) => v !== 0);
      const merged = [];
      let gained = 0, i = 0;
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const val = filtered[i] * 2;
          merged.push(val); gained += val; i += 2;
        } else { merged.push(filtered[i]); i++; }
      }
      while (merged.length < SIZE) merged.push(0);
      return { row: merged, gained };
    }

    function move(dir) {
      let moved = false, gained = 0;
      const ng = JSON.parse(JSON.stringify(grid));
      if (dir === "left") {
        for (let r = 0; r < SIZE; r++) {
          const { row, gained: g } = slideRow(ng[r]);
          if (row.join() !== ng[r].join()) moved = true;
          ng[r] = row; gained += g;
        }
      } else if (dir === "right") {
        for (let r = 0; r < SIZE; r++) {
          const { row, gained: g } = slideRow([...ng[r]].reverse());
          const newRow = row.reverse();
          if (newRow.join() !== ng[r].join()) moved = true;
          ng[r] = newRow; gained += g;
        }
      } else if (dir === "up") {
        for (let c = 0; c < SIZE; c++) {
          const col = ng.map((r) => r[c]);
          const { row, gained: g } = slideRow(col);
          if (row.join() !== col.join()) moved = true;
          ng.forEach((r, i) => (r[c] = row[i])); gained += g;
        }
      } else if (dir === "down") {
        for (let c = 0; c < SIZE; c++) {
          const col = ng.map((r) => r[c]).reverse();
          const { row, gained: g } = slideRow(col);
          const newCol = row.reverse();
          if (newCol.join() !== ng.map((r) => r[c]).join()) moved = true;
          ng.forEach((r, i) => (r[c] = newCol[i])); gained += g;
        }
      }
      if (!moved) return;
      prevGrid = JSON.parse(JSON.stringify(grid));
      prevScore = score;
      grid = ng; score += gained;
      if (score > best) { best = score; localStorage.setItem("2048-best", best); }
      addRandom(grid); render(); checkEnd();
    }

    function checkEnd() {
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (grid[r][c] === 2048) { showOverlay("You Win! 🎉", true); return; }
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          if (grid[r][c] === 0) return;
          if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return;
          if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return;
        }
      showOverlay("Game Over", false);
    }

    function showOverlay(title, win) {
      document.getElementById("overlayTitle").textContent = title;
      document.getElementById("overlayTitle").style.color = win ? "var(--accent)" : "#EF4444";
      document.getElementById("overlayScore").textContent = `Score: ${score}`;
      document.getElementById("overlay").classList.remove("hidden");
    }

    function tileClass(val) {
      const map = { 2:"t2",4:"t4",8:"t8",16:"t16",32:"t32",64:"t64",128:"t128",256:"t256",512:"t512",1024:"t1024",2048:"t2048" };
      return map[val] || "tbig";
    }

    function render() {
      document.getElementById("score").textContent = score;
      document.getElementById("best").textContent = best;
      const board = document.getElementById("board");
      board.innerHTML = "";
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const val = grid[r][c];
          const cell = document.createElement("div");
          cell.className = "cell " + (val ? tileClass(val) : "");
          if (val) {
            const inner = document.createElement("div");
            inner.className = "cell-inner";
            inner.textContent = val;
            cell.appendChild(inner);
          }
          board.appendChild(cell);
        }
      }
    }

    const keyMap = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
    const handleKey = (e) => { if (keyMap[e.key]) { e.preventDefault(); move(keyMap[e.key]); } };
    window.addEventListener("keydown", handleKey);

    let touchX = null, touchY = null;
    const handleTouchStart = (e) => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; };
    const handleTouchEnd = (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
      touchX = touchY = null;
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    const undoHandler = () => {
      if (!prevGrid) return;
      grid = prevGrid; score = prevScore; prevGrid = null;
      document.getElementById("overlay").classList.add("hidden");
      render();
    };

    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("overlayBtn").addEventListener("click", newGame);
    document.getElementById("undoBtn").addEventListener("click", undoHandler);

    newGame();

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.head.removeChild(style);
      document.title = "Ankit Bhardwaj";
    };
  }, []);

  return (
    <>
      <header>
        <div className="g-header-inner">
          <Link to="/" className="g-logo">AB<span>.</span>games</Link>
          <Link to="/games" className="g-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            all games
          </Link>
        </div>
      </header>
      <main>
        <div className="top-bar">
          <h1>2048</h1>
          <div className="scores">
            <div className="score-box">
              <div className="score-label">Score</div>
              <div className="score-val" id="score">0</div>
            </div>
            <div className="score-box">
              <div className="score-label">Best</div>
              <div className="score-val" id="best">0</div>
            </div>
          </div>
        </div>
        <div className="controls">
          <button className="btn btn-primary" id="newGame">New Game</button>
          <button className="btn btn-secondary" id="undoBtn">Undo</button>
        </div>
        <p className="hint">Arrow keys to move · Merge tiles · Reach 2048</p>
        <div className="board-wrap">
          <div className="board" id="board"></div>
          <div className="overlay hidden" id="overlay">
            <div className="overlay-title" id="overlayTitle"></div>
            <div className="overlay-score" id="overlayScore"></div>
            <button className="btn btn-primary" id="overlayBtn">Play Again</button>
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify 2048 in browser**

Navigate to http://localhost:5173/games/2048.

Confirm:
- Dark background, gold "2048" heading, Score/Best boxes
- 4×4 grid renders with two starting tiles
- Arrow keys move and merge tiles; score updates
- "Undo" rolls back one move
- "New Game" resets
- Best score persists across page reloads (localStorage)
- "all games" back link navigates to `/games`

- [ ] **Step 3: Commit**

```bash
git add client/src/games/Game2048.jsx
git commit -m "feat: add 2048 game page"
```

---

## Task 4: Create GameWordle.jsx

**Files:**
- Create: `client/src/games/GameWordle.jsx`

- [ ] **Step 1: Replace the stub with the full component**

Replace `client/src/games/GameWordle.jsx` with:

```jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#111111;--bg2:#1A1A1A;--border:#2A2A2A;--text:#fff;--muted:#888;--muted2:#555;--accent:#E8B84B;--green:#22C55E;--yellow:#E8B84B;--gray:#3A3A3A;}
  html,body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;}
  header{position:sticky;top:0;z-index:50;background:rgba(17,17,17,0.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);}
  .g-header-inner{max-width:480px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;}
  .g-logo{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;color:var(--text);text-decoration:none;letter-spacing:-0.02em;}
  .g-logo span{color:var(--accent);}
  .g-back{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);text-decoration:none;transition:color 0.15s;}
  .g-back:hover{color:var(--accent);}
  main{max-width:480px;margin:0 auto;padding:36px 24px 80px;display:flex;flex-direction:column;align-items:center;}
  .game-header{text-align:center;margin-bottom:28px;width:100%;}
  .game-tag{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:8px;display:block;}
  .game-header h1{font-family:'Syne',sans-serif;font-weight:800;font-size:32px;letter-spacing:-0.03em;margin-bottom:4px;}
  .toast{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg);font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;padding:10px 20px;border-radius:8px;z-index:100;opacity:0;transition:opacity 0.2s;pointer-events:none;}
  .toast.show{opacity:1;}
  .grid{display:flex;flex-direction:column;gap:6px;margin-bottom:24px;}
  .grid-row{display:flex;gap:6px;}
  .tile{width:58px;height:58px;border:2px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:24px;text-transform:uppercase;transition:border-color 0.1s;position:relative;}
  .tile.filled{border-color:#555;animation:pop 0.08s ease;}
  .tile.correct{background:var(--green);border-color:var(--green);color:#fff;}
  .tile.present{background:var(--yellow);border-color:var(--yellow);color:#111;}
  .tile.absent{background:var(--gray);border-color:var(--gray);color:#888;}
  .tile.shake{animation:shake 0.4s ease;}
  .tile.flip{animation:flip 0.5s ease forwards;}
  @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  @keyframes flip{0%{transform:rotateX(0deg)}50%{transform:rotateX(-90deg)}100%{transform:rotateX(0deg)}}
  .keyboard{display:flex;flex-direction:column;gap:6px;width:100%;}
  .kb-row{display:flex;justify-content:center;gap:5px;}
  .key{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;height:52px;min-width:36px;padding:0 6px;border-radius:6px;border:none;cursor:pointer;text-transform:uppercase;background:#2A2A2A;color:var(--text);transition:background 0.15s,color 0.15s;display:flex;align-items:center;justify-content:center;}
  .key.wide{min-width:56px;font-size:11px;}
  .key.correct{background:var(--green);color:#fff;}
  .key.present{background:var(--yellow);color:#111;}
  .key.absent{background:#1A1A1A;color:#444;}
  .key:active{transform:scale(0.95);}
  .divider{width:100%;border:none;border-top:1px solid var(--border);margin:20px 0;}
  .play-again{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;background:var(--accent);color:#111;padding:10px 28px;border-radius:8px;border:none;cursor:pointer;}
  .play-again:hover{background:#d4a83e;}
  .streak-row{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted2);margin-bottom:16px;}
`;

export default function GameWordle() {
  useEffect(() => {
    document.title = "Wordle — Ankit Bhardwaj";
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const WORDS = [
      "react","async","await","class","const","debug","array","stack","queue","proxy",
      "cache","fetch","mutex","scope","parse","build","clone","merge","chunk","slice",
      "error","event","state","props","store","query","index","route","token","modal",
      "patch","types","union","trait","grant","logic","catch","throw","write","reads",
      "hooks","fiber","flame","touch","swipe","click","focus","input","label","table",
      "graph","nodes","links","depth","width","pivot","split","group","order","count",
      "bytes","float","giant","batch","drain","spawn","flush","reset","close","retry",
    ];

    const KB_ROWS = [
      ["q","w","e","r","t","y","u","i","o","p"],
      ["a","s","d","f","g","h","j","k","l"],
      ["Enter","z","x","c","v","b","n","m","⌫"],
    ];

    const ROWS = 6, COLS = 5;
    let target = "", guesses = [], currentGuess = "", gameOver = false, keyStates = {};
    let streak = parseInt(localStorage.getItem("wordle-streak") || "0");
    let played = parseInt(localStorage.getItem("wordle-played") || "0");

    function updateStats() {
      document.getElementById("streakVal").textContent = streak;
      document.getElementById("playedVal").textContent = played;
    }

    function pick() {
      return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    }

    function buildGrid() {
      const grid = document.getElementById("grid");
      grid.innerHTML = "";
      for (let r = 0; r < ROWS; r++) {
        const row = document.createElement("div");
        row.className = "grid-row"; row.id = `row-${r}`;
        for (let c = 0; c < COLS; c++) {
          const tile = document.createElement("div");
          tile.className = "tile"; tile.id = `tile-${r}-${c}`;
          row.appendChild(tile);
        }
        grid.appendChild(row);
      }
    }

    function buildKeyboard() {
      const kb = document.getElementById("keyboard");
      kb.innerHTML = "";
      KB_ROWS.forEach((row) => {
        const r = document.createElement("div");
        r.className = "kb-row";
        row.forEach((k) => {
          const btn = document.createElement("button");
          btn.className = "key" + (k.length > 1 ? " wide" : "");
          btn.textContent = k; btn.dataset.key = k;
          btn.addEventListener("click", () => handleKey(k));
          r.appendChild(btn);
        });
        kb.appendChild(r);
      });
    }

    function showToast(msg, duration = 1800) {
      const t = document.getElementById("toast");
      t.textContent = msg; t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), duration);
    }

    function renderCurrentGuess() {
      for (let c = 0; c < COLS; c++) {
        const tile = document.getElementById(`tile-${guesses.length}-${c}`);
        tile.textContent = currentGuess[c] || "";
        tile.className = "tile" + (currentGuess[c] ? " filled" : "");
      }
    }

    function evaluate(guess) {
      const result = Array(COLS).fill("absent");
      const targetArr = target.split(""), guessArr = guess.split("");
      const used = Array(COLS).fill(false);
      guessArr.forEach((ch, i) => { if (ch === targetArr[i]) { result[i] = "correct"; used[i] = true; } });
      guessArr.forEach((ch, i) => {
        if (result[i] === "correct") return;
        const j = targetArr.findIndex((t, ti) => t === ch && !used[ti]);
        if (j !== -1) { result[i] = "present"; used[j] = true; }
      });
      return result;
    }

    function animateRow(r, states, callback) {
      states.forEach((state, c) => {
        setTimeout(() => {
          const tile = document.getElementById(`tile-${r}-${c}`);
          tile.style.animation = "none"; tile.offsetHeight;
          tile.style.animation = "flip 0.5s ease forwards";
          setTimeout(() => { tile.className = `tile ${state}`; tile.textContent = guesses[r][c]; }, 250);
        }, c * 100);
      });
      setTimeout(callback, states.length * 100 + 500);
    }

    function shakeRow(r) {
      document.querySelectorAll(`#row-${r} .tile`).forEach((t) => {
        t.classList.remove("shake"); void t.offsetWidth; t.classList.add("shake");
      });
    }

    function updateKeyboard(guess, states) {
      const priority = { correct: 3, present: 2, absent: 1 };
      guess.split("").forEach((ch, i) => {
        const prev = keyStates[ch];
        if (!prev || priority[states[i]] > priority[prev]) keyStates[ch] = states[i];
      });
      document.querySelectorAll(".key").forEach((btn) => {
        const k = btn.dataset.key.toUpperCase();
        if (keyStates[k]) btn.className = "key" + (btn.dataset.key.length > 1 ? " wide" : "") + ` ${keyStates[k]}`;
      });
    }

    function handleKey(k) {
      if (gameOver) return;
      if (k === "⌫" || k === "Backspace") { currentGuess = currentGuess.slice(0, -1); renderCurrentGuess(); return; }
      if (k === "Enter") {
        if (currentGuess.length < COLS) { showToast("Not enough letters"); shakeRow(guesses.length); return; }
        if (!WORDS.includes(currentGuess.toLowerCase())) { showToast("Not in word list"); shakeRow(guesses.length); return; }
        const states = evaluate(currentGuess);
        guesses.push(currentGuess);
        const r = guesses.length - 1;
        animateRow(r, states, () => {
          updateKeyboard(currentGuess, states);
          if (currentGuess === target) {
            gameOver = true; streak++; played++;
            localStorage.setItem("wordle-streak", streak); localStorage.setItem("wordle-played", played);
            updateStats();
            setTimeout(() => { showToast(["Genius!","Magnificent!","Impressive!","Splendid!","Great!","Phew!"][r] || "Nice!", 2500); setTimeout(() => addPlayAgain(), 2000); }, 200);
          } else if (guesses.length === ROWS) {
            gameOver = true; streak = 0; played++;
            localStorage.setItem("wordle-streak", streak); localStorage.setItem("wordle-played", played);
            updateStats();
            setTimeout(() => { showToast(target, 3000); setTimeout(() => addPlayAgain(), 2500); }, 200);
          }
        });
        currentGuess = ""; return;
      }
      if (/^[a-zA-Z]$/.test(k) && currentGuess.length < COLS) { currentGuess += k.toUpperCase(); renderCurrentGuess(); }
    }

    function addPlayAgain() {
      if (document.getElementById("playAgainBtn")) return;
      const btn = document.createElement("button");
      btn.className = "play-again"; btn.id = "playAgainBtn";
      btn.textContent = "Play Again"; btn.style.marginTop = "16px";
      btn.addEventListener("click", startGame);
      document.querySelector("main").appendChild(btn);
    }

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Backspace") handleKey("⌫");
      else if (e.key === "Enter") handleKey("Enter");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);

    function startGame() {
      const btn = document.getElementById("playAgainBtn");
      if (btn) btn.remove();
      target = pick(); guesses = []; currentGuess = ""; gameOver = false; keyStates = {};
      buildGrid(); buildKeyboard(); updateStats();
    }

    startGame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.head.removeChild(style);
      document.title = "Ankit Bhardwaj";
    };
  }, []);

  return (
    <>
      <header>
        <div className="g-header-inner">
          <Link to="/" className="g-logo">AB<span>.</span>games</Link>
          <Link to="/games" className="g-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            all games
          </Link>
        </div>
      </header>
      <div className="toast" id="toast"></div>
      <main>
        <div className="game-header">
          <span className="game-tag">Word · Wordle</span>
          <h1>Wordle</h1>
          <p className="streak-row" id="streakRow">
            Streak: <span id="streakVal">0</span> · Played: <span id="playedVal">0</span>
          </p>
        </div>
        <div className="grid" id="grid"></div>
        <hr className="divider" />
        <div className="keyboard" id="keyboard"></div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify Wordle in browser**

Navigate to http://localhost:5173/games/wordle.

Confirm:
- 6×5 empty grid and on-screen keyboard render
- Typing letters fills tiles with pop animation
- Enter submits a guess; tiles flip and colour green/yellow/grey
- Wrong-length or invalid word shakes the row and shows a toast
- Streak/played stats persist across reloads
- "all games" back link works

- [ ] **Step 3: Commit**

```bash
git add client/src/games/GameWordle.jsx
git commit -m "feat: add Wordle game page"
```

---

## Task 5: Create GameTyperacer.jsx

**Files:**
- Create: `client/src/games/GameTyperacer.jsx`

- [ ] **Step 1: Replace the stub with the full component**

Replace `client/src/games/GameTyperacer.jsx` with:

```jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#111111;--bg2:#1A1A1A;--bg3:#161616;--border:#2A2A2A;--text:#fff;--muted:#888;--muted2:#555;--accent:#E8B84B;--green:#22C55E;--red:#EF4444;}
  html,body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;}
  header{position:sticky;top:0;z-index:50;background:rgba(17,17,17,0.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);}
  .g-header-inner{max-width:800px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;}
  .g-logo{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;color:var(--text);text-decoration:none;letter-spacing:-0.02em;}
  .g-logo span{color:var(--accent);}
  .g-back{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);text-decoration:none;transition:color 0.15s;}
  .g-back:hover{color:var(--accent);}
  main{max-width:800px;margin:0 auto;padding:48px 24px 80px;}
  .game-header{text-align:center;margin-bottom:40px;}
  .game-tag{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:10px;display:block;}
  .game-header h1{font-family:'Syne',sans-serif;font-weight:800;font-size:36px;letter-spacing:-0.03em;margin-bottom:8px;}
  .game-sub{font-size:14px;color:var(--muted);}
  .stats{display:flex;justify-content:center;gap:32px;margin-bottom:32px;}
  .stat{text-align:center;}
  .stat-val{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;color:var(--accent);line-height:1;}
  .stat-label{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted2);margin-top:4px;}
  .progress-wrap{background:var(--bg2);border:1px solid var(--border);border-radius:4px;height:4px;margin-bottom:24px;overflow:hidden;}
  .progress-bar{height:100%;background:var(--accent);width:0%;transition:width 0.3s;border-radius:4px;}
  .code-window{background:var(--bg3);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:20px;}
  .code-chrome{display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg2);}
  .dot{width:10px;height:10px;border-radius:50%;}
  .dot.r{background:#EF4444;} .dot.y{background:#F59E0B;} .dot.g{background:#22C55E;}
  .code-filename{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted2);margin-left:6px;}
  .code-content{padding:24px;font-family:'JetBrains Mono',monospace;font-size:15px;line-height:1.8;letter-spacing:0.01em;min-height:100px;}
  .char{transition:color 0.05s;}
  .char.correct{color:var(--green);}
  .char.wrong{color:var(--red);background:rgba(239,68,68,0.15);border-radius:2px;}
  .char.cursor{border-left:2px solid var(--accent);margin-left:-1px;animation:blink 1s step-end infinite;}
  .char.pending{color:var(--muted);}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .input-area{margin-bottom:24px;position:relative;}
  #typeInput{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--text);outline:none;transition:border-color 0.15s;resize:none;height:54px;}
  #typeInput:focus{border-color:var(--accent);}
  #typeInput:disabled{opacity:0.4;cursor:not-allowed;}
  .btn-row{display:flex;justify-content:center;gap:12px;margin-bottom:32px;}
  .btn{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:10px 28px;border-radius:8px;cursor:pointer;border:none;transition:all 0.15s;}
  .btn-primary{background:var(--accent);color:#111;}
  .btn-primary:hover{background:#d4a83e;}
  .btn-secondary{background:transparent;color:var(--muted);border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;}
  .btn-secondary:hover{border-color:var(--accent);color:var(--accent);}
  .result-screen{text-align:center;padding:40px 0;}
  .result-wpm{font-family:'Syne',sans-serif;font-weight:800;font-size:64px;color:var(--accent);line-height:1;}
  .result-label{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted2);margin-bottom:24px;}
  .result-stats{display:flex;justify-content:center;gap:32px;margin-bottom:32px;}
  .result-stat{text-align:center;}
  .result-stat-val{font-family:'Syne',sans-serif;font-weight:700;font-size:22px;color:var(--text);}
  .result-stat-label{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.08em;}
  .snippet-tabs{display:flex;justify-content:center;gap:8px;margin-bottom:32px;}
  .snippet-tab{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;padding:5px 14px;border-radius:4px;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all 0.15s;}
  .snippet-tab.active{border-color:var(--accent);color:var(--accent);background:rgba(232,184,75,0.08);}
  .snippet-tab:hover:not(.active){border-color:var(--muted);color:var(--text);}
  .hidden{display:none!important;}
`;

export default function GameTyperacer() {
  useEffect(() => {
    document.title = "Type Racer — Ankit Bhardwaj";
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const SNIPPETS = [
      { lang: "JavaScript", file: "utils.js", text: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}" },
      { lang: "TypeScript", file: "types.ts", text: "interface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n  timestamp: Date;\n}" },
      { lang: "React", file: "Component.jsx", text: "const useLocalStorage = (key, initial) => {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n  return [value, setValue];\n};" },
      { lang: "Node.js", file: "server.js", text: "app.use(async (req, res, next) => {\n  try {\n    const token = req.headers.authorization?.split(' ')[1];\n    if (!token) throw new AppError(401, 'Unauthorized');\n    req.user = await verifyToken(token);\n    next();\n  } catch (err) { next(err); }\n});" },
    ];

    let currentSnippetIdx = 0;
    let snippet = SNIPPETS[0];
    let state = "idle";
    let charIdx = 0, errors = 0, totalTyped = 0;
    let startTime = null, timerInterval = null;
    let errorPositions = new Set();

    const codeDisplay  = document.getElementById("codeDisplay");
    const typeInput    = document.getElementById("typeInput");
    const startBtn     = document.getElementById("startBtn");
    const progressBar  = document.getElementById("progressBar");
    const wpmDisplay   = document.getElementById("wpmDisplay");
    const accDisplay   = document.getElementById("accDisplay");
    const timerDisplay = document.getElementById("timerDisplay");
    const errDisplay   = document.getElementById("errDisplay");
    const resultScreen = document.getElementById("resultScreen");
    const gameArea     = document.getElementById("gameArea");
    const inputArea    = document.getElementById("inputArea");
    const statsEl      = document.getElementById("stats");
    const codeFilename = document.getElementById("codeFilename");

    function renderCode() {
      codeDisplay.innerHTML = snippet.text.split("").map((ch, i) => {
        let cls = "char pending";
        if (i < charIdx) cls = errorPositions.has(i) ? "char wrong" : "char correct";
        else if (i === charIdx) cls = "char cursor";
        const display = ch === "\n" ? "↵\n" : ch === " " ? "&nbsp;" : ch;
        return `<span class="${cls}" data-i="${i}">${display}</span>`;
      }).join("");
    }

    function getWPM() {
      if (!startTime) return 0;
      const mins = (Date.now() - startTime) / 60000;
      return Math.round((charIdx / 5) / Math.max(mins, 0.01));
    }
    function getAcc() {
      if (totalTyped === 0) return 100;
      return Math.round(((totalTyped - errors) / totalTyped) * 100);
    }

    function updateStats() {
      const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      wpmDisplay.textContent  = getWPM();
      accDisplay.textContent  = getAcc() + "%";
      timerDisplay.textContent = elapsed + "s";
      errDisplay.textContent  = errors;
      progressBar.style.width = ((charIdx / snippet.text.length) * 100) + "%";
    }

    function finish() {
      state = "finished";
      clearInterval(timerInterval);
      typeInput.disabled = true;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      document.getElementById("finalWpm").textContent    = getWPM();
      document.getElementById("finalAcc").textContent    = getAcc() + "%";
      document.getElementById("finalTime").textContent   = elapsed + "s";
      document.getElementById("finalErrors").textContent = errors;
      gameArea.classList.add("hidden");
      inputArea.classList.add("hidden");
      statsEl.classList.add("hidden");
      document.getElementById("snippetTabs").classList.add("hidden");
      document.querySelector(".btn-row").classList.add("hidden");
      resultScreen.classList.remove("hidden");
    }

    const handleInput = () => {
      if (state !== "running") return;
      const val = typeInput.value;
      if (val.length === 0) return;
      const typed = val[val.length - 1];
      totalTyped++;
      if (typed === snippet.text[charIdx]) { charIdx++; }
      else { errors++; errorPositions.add(charIdx); charIdx++; }
      typeInput.value = "";
      renderCode(); updateStats();
      if (charIdx >= snippet.text.length) finish();
    };
    typeInput.addEventListener("input", handleInput);

    function startGame() {
      state = "running"; charIdx = 0; errors = 0; totalTyped = 0;
      errorPositions.clear(); startTime = Date.now();
      typeInput.disabled = false; typeInput.value = ""; typeInput.focus();
      startBtn.textContent = "Restart";
      clearInterval(timerInterval);
      timerInterval = setInterval(updateStats, 500);
      renderCode(); updateStats();
    }

    function reset() {
      state = "idle"; clearInterval(timerInterval);
      charIdx = 0; errors = 0; totalTyped = 0; startTime = null;
      errorPositions.clear();
      typeInput.disabled = false; typeInput.value = "";
      startBtn.textContent = "Start";
      progressBar.style.width = "0%";
      wpmDisplay.textContent = "0"; accDisplay.textContent = "100%";
      timerDisplay.textContent = "0s"; errDisplay.textContent = "0";
      gameArea.classList.remove("hidden"); inputArea.classList.remove("hidden");
      statsEl.classList.remove("hidden");
      document.getElementById("snippetTabs").classList.remove("hidden");
      document.querySelector(".btn-row").classList.remove("hidden");
      resultScreen.classList.add("hidden");
      renderCode();
    }

    function loadSnippet(idx) {
      currentSnippetIdx = idx; snippet = SNIPPETS[idx];
      codeFilename.textContent = snippet.file;
      document.querySelectorAll(".snippet-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
      reset();
    }

    startBtn.addEventListener("click", startGame);
    document.getElementById("resetBtn").addEventListener("click", reset);
    document.getElementById("retryBtn").addEventListener("click", () => loadSnippet(currentSnippetIdx));
    document.querySelectorAll(".snippet-tab").forEach((tab) => {
      tab.addEventListener("click", () => loadSnippet(parseInt(tab.dataset.idx)));
    });

    loadSnippet(0);

    return () => {
      clearInterval(timerInterval);
      typeInput.removeEventListener("input", handleInput);
      document.head.removeChild(style);
      document.title = "Ankit Bhardwaj";
    };
  }, []);

  return (
    <>
      <header>
        <div className="g-header-inner">
          <Link to="/" className="g-logo">AB<span>.</span>games</Link>
          <Link to="/games" className="g-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            all games
          </Link>
        </div>
      </header>
      <main>
        <div className="game-header">
          <span className="game-tag">Dev-themed · Type Racer</span>
          <h1>Type Racer</h1>
          <p className="game-sub">Type the code snippet as fast and accurately as possible</p>
        </div>

        <div className="snippet-tabs" id="snippetTabs">
          <button className="snippet-tab active" data-idx="0">JavaScript</button>
          <button className="snippet-tab" data-idx="1">TypeScript</button>
          <button className="snippet-tab" data-idx="2">React</button>
          <button className="snippet-tab" data-idx="3">Node.js</button>
        </div>

        <div className="stats" id="stats">
          <div className="stat"><div className="stat-val" id="wpmDisplay">0</div><div className="stat-label">WPM</div></div>
          <div className="stat"><div className="stat-val" id="accDisplay">100%</div><div className="stat-label">Accuracy</div></div>
          <div className="stat"><div className="stat-val" id="timerDisplay">0s</div><div className="stat-label">Time</div></div>
          <div className="stat"><div className="stat-val" id="errDisplay">0</div><div className="stat-label">Errors</div></div>
        </div>

        <div className="progress-wrap"><div className="progress-bar" id="progressBar"></div></div>

        <div className="code-window" id="gameArea">
          <div className="code-chrome">
            <div className="dot r"></div>
            <div className="dot y"></div>
            <div className="dot g"></div>
            <span className="code-filename" id="codeFilename">snippet.js</span>
          </div>
          <div className="code-content" id="codeDisplay"></div>
        </div>

        <div className="input-area" id="inputArea">
          <input
            id="typeInput"
            type="text"
            placeholder="Click here and start typing…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" id="startBtn">Start</button>
          <button className="btn btn-secondary" id="resetBtn">Reset</button>
        </div>

        <div className="result-screen hidden" id="resultScreen">
          <div className="result-wpm" id="finalWpm">0</div>
          <div className="result-label">words per minute</div>
          <div className="result-stats">
            <div className="result-stat"><div className="result-stat-val" id="finalAcc">-</div><div className="result-stat-label">Accuracy</div></div>
            <div className="result-stat"><div className="result-stat-val" id="finalTime">-</div><div className="result-stat-label">Time</div></div>
            <div className="result-stat"><div className="result-stat-val" id="finalErrors">-</div><div className="result-stat-label">Errors</div></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" id="retryBtn">Try Again</button>
            <Link to="/games" className="btn btn-secondary">Back to Games</Link>
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify Type Racer in browser**

Navigate to http://localhost:5173/games/typeracer.

Confirm:
- Code window shows the JavaScript snippet; pending chars are grey
- Click "Start" — input activates, timer starts
- Typing correct chars turns them green; wrong chars turn red
- WPM, accuracy, time, errors update live
- Language tab buttons switch snippets and reset the game
- Completing a snippet shows the result screen with final WPM
- "Try Again" resets current snippet; "Back to Games" navigates to `/games`
- "Reset" returns to idle state

- [ ] **Step 3: Final smoke test — full flow**

Check the complete navigation flow:
1. Home page `/` — header shows "Games" link
2. Click "Games" — navigates to `/games`; three cards render
3. Click "2048" card — game renders, arrow keys work, back link returns to `/games`
4. Click "Wordle" card — game renders, typing works, back link returns to `/games`
5. Click "Type Racer" card — game renders, "Back to Games" returns to `/games`
6. Check mobile: header mobile drawer shows "Games" link

- [ ] **Step 4: Commit**

```bash
git add client/src/games/GameTyperacer.jsx
git commit -m "feat: add Type Racer game page"
```
