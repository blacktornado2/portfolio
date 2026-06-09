import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg:#111111;--bg2:#1A1A1A;--border:#2A2A2A;--text:#fff;--muted:#888;--muted2:#555;--accent:var(--accent); }
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
  .btn-primary:hover{background:var(--accent-dark);}
  .btn-secondary{background:var(--bg2);color:var(--muted);border:1px solid var(--border);}
  .btn-secondary:hover{border-color:var(--accent);color:var(--accent);}
  .hint{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted2);margin-bottom:16px;}
  .board-wrap{position:relative;}
  .board{background:#1A1A1A;border:1px solid var(--border);border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;aspect-ratio:1;}
  .cell{border-radius:6px;background:#222;border:1px solid #2A2A2A;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;aspect-ratio:1;transition:all 0.1s ease;position:relative;overflow:hidden;}
  .cell-inner{font-size:clamp(14px,3.5vw,28px);line-height:1;}
  .t2{background:#2A2A2A;color:#ccc;border-color:#333;}
  .t4{background:#3A2E10;color:var(--accent);border-color:#4A3A14;}
  .t8{background:#5C3A00;color:#FFD080;border-color:#7A4D00;}
  .t16{background:#7A2C00;color:#FFA060;border-color:#992E00;}
  .t32{background:#8B1E1E;color:#FFB0B0;border-color:#AA2222;}
  .t64{background:#6B1515;color:#FF8888;border-color:#881818;}
  .t128{background:#1E5C1E;color:#88FF88;border-color:#227722;}
  .t256{background:#1A4D1A;color:#66FF66;border-color:#1E601E;}
  .t512{background:#0F3C4A;color:#66EEFF;border-color:#125560;}
  .t1024{background:#0A2A38;color:#44DDFF;border-color:#0E3F55;}
  .t2048{background:var(--accent);color:#111;border-color:#FFD080;}
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

    document.getElementById("newGame")?.addEventListener("click", newGame);
    document.getElementById("overlayBtn")?.addEventListener("click", newGame);
    document.getElementById("undoBtn")?.addEventListener("click", undoHandler);

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
