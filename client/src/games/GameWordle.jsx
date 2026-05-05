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
