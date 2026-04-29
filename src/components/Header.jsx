import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "skills", "experience", "education", "contact"];
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

  const navLinks = [
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <HashLink
          to="/#home"
          smooth
          className="font-syne font-bold text-white text-lg hover:text-[#E8B84B] transition-colors"
        >
          Ankit Bhardwaj
        </HashLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ id, label }) => (
            <HashLink
              key={id}
              to={`/#${id}`}
              smooth
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-[#E8B84B] ${
                activeSection === id ? "text-[#E8B84B]" : "text-[#888888]"
              }`}
            >
              {label}
            </HashLink>
          ))}
          <HashLink
            to="/#contact"
            smooth
            className="font-syne font-bold text-sm bg-[#E8B84B] text-[#111111] px-4 py-2 rounded-md hover:bg-[#d4a83e] transition-colors"
          >
            Hire Me
          </HashLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#2A2A2A] px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ id, label }) => (
            <HashLink
              key={id}
              to={`/#${id}`}
              smooth
              onClick={() => setMenuOpen(false)}
              className="text-[#888888] hover:text-[#E8B84B] transition-colors font-medium"
            >
              {label}
            </HashLink>
          ))}
          <HashLink
            to="/#contact"
            smooth
            onClick={() => setMenuOpen(false)}
            className="font-syne font-bold text-sm bg-[#E8B84B] text-[#111111] px-4 py-3 rounded-md text-center hover:bg-[#d4a83e] transition-colors"
          >
            Hire Me
          </HashLink>
        </div>
      )}
    </header>
  );
}
