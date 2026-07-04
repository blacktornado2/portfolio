import React from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useSeo } from "@/lib/seo";

function GameCard({ href, tag, title, description, preview, previewBg }) {
  return (
    <Link
      to={href}
      className="group block bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden no-underline transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5"
    >
      <div
        className="h-[180px] flex items-center justify-center overflow-hidden"
        style={{ background: previewBg }}
      >
        <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          {preview}
        </div>
      </div>
      <div className="p-6">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)] inline-block mb-2.5">
          {tag}
        </span>
        <h2 className="font-syne font-bold text-xl text-[var(--text-1)] mb-2 tracking-tight group-hover:text-[var(--accent)] transition-colors duration-150">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">{description}</p>
        <span className="font-mono text-xs text-[var(--accent)] group-hover:tracking-wider transition-all duration-150">
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
        <rect x="10" y="38" width="55" height="10" rx="2" fill="var(--accent)" opacity="0.8" />
        <rect x="10" y="54" width="180" height="8" rx="2" fill="#222" />
        <rect x="10" y="66" width="130" height="8" rx="2" fill="#222" />
        <text x="10" y="30" fontFamily="JetBrains Mono" fontSize="11" fill="#555">
          const dev = &apos;ankit&apos;
        </text>
        <rect x="68" y="25" width="1.5" height="13" fill="var(--accent)" opacity="0.9">
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
        <rect x="63" y="63" width="52" height="52" rx="4" fill="var(--accent)" />
        <text x="89" y="35" fontFamily="Syne,sans-serif" fontSize="18" fontWeight="800" fill="var(--accent)" textAnchor="middle">64</text>
        <text x="31" y="35" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="700" fill="#888" textAnchor="middle">16</text>
        <text x="31" y="93" fontFamily="Syne,sans-serif" fontSize="14" fontWeight="700" fill="var(--accent)" opacity="0.6" textAnchor="middle">32</text>
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
        <rect x="10" y="44" width="28" height="28" rx="3" fill="var(--accent)" opacity="0.7" />
        <rect x="44" y="44" width="28" height="28" rx="3" fill="#2A2A2A" />
        <rect x="78" y="44" width="28" height="28" rx="3" fill="#2A2A2A" />
        <rect x="112" y="44" width="28" height="28" rx="3" fill="var(--accent)" opacity="0.7" />
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
  useSeo({
    title: "Games",
    description:
      "Side quests by Ankit Bhardwaj — playable browser builds of 2048, Wordle, and a typing racer.",
    path: "/games",
  });
  return (
    <main className="bg-[var(--bg)] min-h-screen text-[var(--text-1)]">
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-95)] backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-syne font-bold text-[var(--text-2)] hover:text-[var(--accent)] transition-colors text-sm"
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
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-3)] mb-3">
            Mini Games
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(32px,6vw,52px)] leading-[1.1] tracking-[-0.04em] mb-4">
            Play something.<br />
            <span className="text-[var(--accent)]">Take a break.</span>
          </h1>
          <p className="text-base text-[var(--text-2)] max-w-md leading-relaxed">
            A few games built entirely in the browser — no installs, no accounts. Just pure JavaScript fun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
