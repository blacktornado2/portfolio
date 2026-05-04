---
title: Games Integration Design
date: 2026-05-04
status: approved
---

# Games Integration — Design Spec

## Overview

Add a Games section to the portfolio. A "Games" nav item in the header links to `/games`, which is a lobby page showing three game cards. Each card navigates (same tab) to an individual game page at `/games/2048`, `/games/wordle`, and `/games/typeracer`. The back button returns the user to `/games`.

## Approach: React Shell + Vanilla JS (C-2 Hybrid)

The three games are self-contained vanilla JS with direct DOM manipulation. Rather than rewriting them in React, each game gets a React component that:
- Returns JSX (the game's HTML structure, mechanically converted from HTML to JSX)
- Uses a single `useEffect(fn, [])` to run the game's vanilla JS logic after mount
- Injects game-specific CSS as a `<style>` element in `document.head` inside the effect
- Returns a cleanup function from the effect that removes all event listeners, clears intervals, and removes the injected `<style>`

No `useState`, no Framer Motion, no reimplementation of game logic.

## Files

### New files
| File | Purpose |
|---|---|
| `client/src/games/GamesIndex.jsx` | `/games` lobby — game card grid |
| `client/src/games/Game2048.jsx` | `/games/2048` — 2048 game |
| `client/src/games/GameWordle.jsx` | `/games/wordle` — Wordle game |
| `client/src/games/GameTyperacer.jsx` | `/games/typeracer` — Type Racer game |

### Modified files
| File | Change |
|---|---|
| `client/src/App.jsx` | Add 4 new routes |
| `client/src/components/Header.jsx` | Add Games nav link |

## Routes

```
/games            → GamesIndex.jsx
/games/2048       → Game2048.jsx
/games/wordle     → GameWordle.jsx
/games/typeracer  → GameTyperacer.jsx
```

Added to `App.jsx` alongside the existing `/blog` routes. No nested routing needed.

## Header Change

Add one entry to `navLinks` in `Header.jsx`:

```js
{ id: "games", label: "Games", href: "/games" }
```

Uses the existing `Link` pattern (same as "Blog"). Appears in both desktop nav and mobile drawer. No active-section highlighting — it is a route link, not a hash anchor.

## GamesIndex.jsx

Pure React + Tailwind. No vanilla JS. Structure mirrors `BlogIndex.jsx`:
- Sticky header with back-to-portfolio `Link to="/"`
- Page header: eyebrow "Mini Games", heading "Play something. Take a break.", subtitle
- CSS grid of three game cards
- Each card: `Link to="/games/2048"` (etc.), preview SVG, tag pill, title, description, "Play now →" CTA

Styled with the portfolio design tokens (`#111111` bg, `#E8B84B` accent, `font-syne`, `font-mono`).

## Game Component Structure (per game)

```jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Game2048() {
  useEffect(() => {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.textContent = `/* game-specific CSS */`;
    document.head.appendChild(style);

    // 2. All vanilla JS game logic (unchanged from original <script>)
    //    document.getElementById() calls work because DOM is ready

    // 3. Attach event listeners
    window.addEventListener('keydown', handleKey);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 4. Init
    newGame();

    // 5. Cleanup
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      document.head.removeChild(style);
    };
  }, []);

  return (
    // HTML structure from original file, converted to JSX
    // IDs preserved so vanilla JS can find elements
    // Back links: <Link to="/games"> instead of href="index.html"
  );
}
```

### Per-game notes

**Game2048.jsx**
- Cleanup: remove `keydown`, `touchstart`, `touchend` listeners; remove style
- `localStorage` key `2048-best` for high score — preserved as-is

**GameWordle.jsx**
- Cleanup: remove `keydown` listener; remove style
- CSS animations (flip, shake, pop) stay in the injected style tag
- `localStorage` keys `wordle-streak`, `wordle-played` — preserved as-is
- The "Play Again" button is dynamically appended to `<main>` by JS — preserved as-is

**GameTyperacer.jsx**
- Cleanup: `clearInterval(timerInterval)`, remove `input` listener on `#typeInput`, remove style
- The "Back to Games" `onclick="window.location.href='index.html'"` becomes a `useNavigate` call triggered from a data attribute or replaced with a `Link` in JSX
- Tab buttons (JS/TS/React/Node.js) use `document.querySelectorAll` — preserved as-is

## Navigation

- **Portfolio → Games lobby**: Header "Games" link (`/games`)
- **Lobby → Game**: `Link to="/games/2048"` etc. (same tab)
- **Game → Lobby**: `Link to="/games"` in the game's header (replaces `href="index.html"`)
- **Back button**: Browser back works naturally since all navigation is React Router pushes

## What is NOT changing

- The original `.html` files in `client/src/games/` are not deleted (they are not served by Vite from `src/`, so they cause no conflict)
- No game logic is rewritten
- No new dependencies needed
