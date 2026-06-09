import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { myEmail, myGithub, myLinkedIn } from "@/constants";

// ── Icons ──────────────────────────────────────────────────────────────────────
const IHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ICode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const IBriefcase = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IFolder = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IBook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const IFile = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IGamepad = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
    <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="17" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M6 8h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
  </svg>
);

const IQuote = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const IPen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const IGithub = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ILinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ICopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ICON_MAP = {
  home: <IHome />, code: <ICode />, briefcase: <IBriefcase />,
  folder: <IFolder />, book: <IBook />, mail: <IMail />, file: <IFile />,
  gamepad: <IGamepad />, quote: <IQuote />, pen: <IPen />,
  github: <IGithub />, linkedin: <ILinkedin />, copy: <ICopy />,
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [toast, setToast] = useState(false);

  const scrollToSection = useCallback((id) => {
    onClose();
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  }, [location.pathname, navigate, onClose]);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(myEmail).catch(() => { });
    setToast(true);
    onClose();
    setTimeout(() => setToast(false), 2200);
  }, [onClose]);

  const COMMANDS = useMemo(() => [
    {
      group: "Sections",
      items: [
        { id: "home",         label: "Go to Home",           icon: "home",      action: () => scrollToSection("home") },
        { id: "experience",   label: "Go to Experience",     icon: "briefcase", action: () => scrollToSection("experience") },
        { id: "projects",     label: "Go to Projects",       icon: "folder",    action: () => scrollToSection("projects") },
        { id: "dev-notes",    label: "Go to Dev Notes",      icon: "file",      action: () => scrollToSection("blog") },
        { id: "side-quests",  label: "Go to Side Quests",    icon: "gamepad",   action: () => scrollToSection("games") },
        { id: "skills",       label: "Go to Skills",         icon: "code",      action: () => scrollToSection("skills") },
        { id: "testimonials", label: "Go to Testimonials",   icon: "quote",     action: () => scrollToSection("testimonials") },
        { id: "contact",      label: "Go to Contact",        icon: "mail",      action: () => scrollToSection("contact") },
      ],
    },
    {
      group: "Pages",
      items: [
        { id: "blog",   label: "Open Blog",       icon: "book", hint: "↗", action: () => { onClose(); navigate("/blog"); } },
        { id: "games",  label: "Open Games",      icon: "gamepad", hint: "↗", action: () => { onClose(); navigate("/games"); } },
        { id: "draw",   label: "Open Draw Tool",  icon: "pen",  hint: "↗", action: () => { onClose(); navigate("/draw"); } },
      ],
    },
    {
      group: "Social",
      items: [
        { id: "github",   label: "Open GitHub",   icon: "github",   hint: "↗", action: () => { window.open(myGithub, "_blank"); onClose(); } },
        { id: "linkedin", label: "Open LinkedIn", icon: "linkedin", hint: "↗", action: () => { window.open(myLinkedIn, "_blank"); onClose(); } },
      ],
    },
    {
      group: "Actions",
      items: [
        { id: "email", label: "Copy Email Address", icon: "copy", action: copyEmail },
      ],
    },
  ], [scrollToSection, copyEmail, onClose, navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query, COMMANDS]);

  const flatItems = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset active index when query changes
  useEffect(() => { setActiveIdx(0); }, [query]);

  // Scroll active item into view on keyboard navigation
  useEffect(() => {
    if (!listRef.current || !isOpen) return;
    const el = listRef.current.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, isOpen]);

  // Keyboard navigation while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); flatItems[activeIdx]?.action(); }
      else if (e.key === "Escape") { onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, flatItems, activeIdx, onClose]);

  const content = (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-[4px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              className="fixed z-[201] w-[calc(100%-32px)] max-w-[560px]"
              style={{ top: "18%", left: "50%" }}
              initial={{ opacity: 0, scale: 0.96, y: -8, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.96, y: -8, x: "-50%" }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow border */}
              <div className="absolute inset-[-1px] rounded-[13px] bg-gradient-to-br from-[#E8B84B]/20 to-transparent pointer-events-none" />

              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.04)_inset]">
                {/* Search row */}
                <div className="flex items-center gap-3 px-4 border-b border-[#2A2A2A]">
                  <svg className="text-[#555555] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a command or search…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-sans text-[15px] text-white py-4 placeholder-[#555555]"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span className="font-mono text-[10px] text-[#555555] border border-[#2A2A2A] rounded px-[6px] py-[2px] shrink-0">
                    esc
                  </span>
                </div>

                {/* Results */}
                <div ref={listRef} className="cmd-palette-results max-h-[360px] overflow-y-auto py-2">
                  {flatItems.length === 0 ? (
                    <div className="py-10 text-center font-mono text-[13px] text-[#555555]">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    filtered.map((group) => (
                      <div key={group.group}>
                        <div className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#555555]">
                          {group.group}
                        </div>
                        {group.items.map((item) => {
                          const idx = flatItems.indexOf(item);
                          const isActive = idx === activeIdx;
                          return (
                            <button
                              key={item.id}
                              data-active={String(isActive)}
                              onClick={() => item.action()}
                              onMouseEnter={() => setActiveIdx(idx)}
                              className={`flex items-center gap-3 w-full px-4 py-2.5 text-left border-0 cursor-pointer transition-colors duration-75 ${isActive
                                ? "bg-[#E8B84B]/10 text-[#E8B84B]"
                                : "bg-transparent text-[#cccccc]"
                                }`}
                            >
                              <span className={`w-4 flex items-center shrink-0 ${isActive ? "text-[#E8B84B]" : "text-[#555555]"}`}>
                                {ICON_MAP[item.icon]}
                              </span>
                              <span className="font-sans text-[14px] flex-1">{item.label}</span>
                              {item.hint && (
                                <span className="font-mono text-[12px] text-[#555555]">{item.hint}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#2A2A2A]">
                  {[["↑↓", "navigate"], ["↵", "open"], ["esc", "close"]].map(([key, label]) => (
                    <span key={label} className="flex items-center gap-1.5 font-mono text-[10px] text-[#555555]">
                      <kbd className="border border-[#2A2A2A] rounded px-[5px] py-[1px] text-[10px] font-mono">
                        {key}
                      </kbd>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 z-[300] bg-[#1A1A1A] border border-[#E8B84B] text-[#E8B84B] font-mono text-[12px] px-5 py-2.5 rounded-lg whitespace-nowrap"
            style={{ left: "50%" }}
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.2 }}
          >
            ✓ Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(content, document.body);
}
