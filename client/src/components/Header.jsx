import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import CommandPalette from "./CommandPalette";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const ids = ["home", "about", "experience", "projects", "blog", "games", "skills", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" },
    { id: "games", label: "Games" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-95)] backdrop-blur-sm border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left z-50"
          style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <HashLink
            to="/#home"
            smooth
            className="font-syne font-bold text-[var(--text-1)] text-lg hover:text-[var(--accent)] transition-colors"
          >
            Ankit Bhardwaj
          </HashLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ id, label, href }) =>
              href ? (
                <Link
                  key={id}
                  to={href}
                  className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <HashLink
                  key={id}
                  to={`/#${id}`}
                  smooth
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent)] ${
                    activeSection === id ? "text-[var(--accent)]" : "text-[var(--text-2)]"
                  }`}
                >
                  {label}
                </HashLink>
              )
            )}

            {/* Search trigger */}
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 font-mono text-[11px] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150 group"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
              <span className="border border-[var(--border)] rounded px-[5px] py-[1px] text-[10px] text-[var(--text-3)] group-hover:border-[var(--accent-40)] transition-colors">
                ⌘K
              </span>
            </button>

            <HashLink
              to="/#contact"
              smooth
              className="font-syne font-bold text-sm bg-[var(--accent)] text-[#111111] px-4 py-2 rounded-md hover:bg-[var(--accent-dark)] transition-colors"
            >
              Hire Me
            </HashLink>
          </nav>

          {/* Mobile — search icon + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button
              className="text-[var(--text-1)] p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--surface)] border-t border-[var(--border)] px-6 py-6 flex flex-col gap-5">
            {navLinks.map(({ id, label, href }) =>
              href ? (
                <Link
                  key={id}
                  to={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  {label}
                </Link>
              ) : (
                <HashLink
                  key={id}
                  to={`/#${id}`}
                  smooth
                  onClick={() => setMenuOpen(false)}
                  className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  {label}
                </HashLink>
              )
            )}
            <HashLink
              to="/#contact"
              smooth
              onClick={() => setMenuOpen(false)}
              className="font-syne font-bold text-sm bg-[var(--accent)] text-[#111111] px-4 py-3 rounded-md text-center hover:bg-[var(--accent-dark)] transition-colors"
            >
              Hire Me
            </HashLink>
          </div>
        )}
      </header>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
