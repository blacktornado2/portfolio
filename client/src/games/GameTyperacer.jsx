import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#111111;--bg2:#1A1A1A;--bg3:#161616;--border:#2A2A2A;--text:#fff;--muted:#888;--muted2:#555;--accent:var(--accent);--green:#22C55E;--red:#EF4444;}
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
  .code-content{padding:24px;font-family:'JetBrains Mono',monospace;font-size:15px;line-height:1.8;letter-spacing:0.01em;min-height:100px;white-space:pre-wrap;}
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
  .btn-primary:hover{background:var(--accent-dark);}
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
      document.getElementById("gameControls").classList.add("hidden");
      document.getElementById("progressWrap").classList.add("hidden");
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

    const handleKeyDown = (e) => {
      if (state !== "running" || e.key !== "Enter") return;
      e.preventDefault();
      totalTyped++;
      if (snippet.text[charIdx] === "\n") { charIdx++; }
      else { errors++; errorPositions.add(charIdx); charIdx++; }
      typeInput.value = "";
      renderCode(); updateStats();
      if (charIdx >= snippet.text.length) finish();
    };
    typeInput.addEventListener("keydown", handleKeyDown);

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
      document.getElementById("gameControls").classList.remove("hidden");
      document.getElementById("progressWrap").classList.remove("hidden");
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
    document.getElementById("resetBtn")?.addEventListener("click", reset);
    document.getElementById("retryBtn")?.addEventListener("click", () => loadSnippet(currentSnippetIdx));
    document.querySelectorAll(".snippet-tab").forEach((tab) => {
      tab.addEventListener("click", () => loadSnippet(parseInt(tab.dataset.idx)));
    });

    loadSnippet(0);

    return () => {
      clearInterval(timerInterval);
      typeInput.removeEventListener("input", handleInput);
      typeInput.removeEventListener("keydown", handleKeyDown);
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

        <div className="progress-wrap" id="progressWrap"><div className="progress-bar" id="progressBar"></div></div>

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

        <div className="btn-row" id="gameControls">
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
