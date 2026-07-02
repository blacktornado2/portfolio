import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import { motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";
import PortfolioPage from "./PortfolioPage";
import SectionDivider from "./SectionDivider";
import { useTheme } from "../lib/ThemeContext";
import { myEmail } from "../constants";

const CODE = `const profile = {
    name: 'Ankit Bhardwaj',
    title: 'Software Developer',
    email: '${myEmail}',
    skills: [
        'React Native', 'React.js', 'Vue.js',
        'Node.js', 'TypeScript', 'Nest.js',
        'MongoDB', 'PostgreSQL',
    ],
    experience: '4+ years',
    openToWork: true,
};`;

const FADE_UP = [0.1, 0.2, 0.3, 0.4, 0.5].map((delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
}));

const CODE_WINDOW_ANIM = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay: 0.2 },
};

export default function Hero() {
  const { theme } = useTheme();
  const codeRef = useRef(null);
  const [typedLength, setTypedLength] = useState(0);
  const [closed, setClosed] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTypedLength(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedLength(i);
      if (i >= CODE.length) clearInterval(interval);
    }, 14);
    return () => clearInterval(interval);
  }, [cycle]);

  const handleClose = () => {
    setClosed(true);
    setTimeout(() => {
      setClosed(false);
      setCycle((c) => c + 1);
    }, 900);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const code = codeRef.current;
    if (!code) return;
    code.textContent = CODE.slice(0, typedLength);
    Prism.highlightElement(code);
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    code.appendChild(cursor);
  }, [typedLength]);

  return (
    <main className="bg-[var(--bg)] text-[var(--text-1)]">
      {/* ── Hero section ── */}
      <section className="min-h-screen flex items-center px-6 lg:px-12 pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16">

          {/* Left column */}
          <div className="space-y-6">
            {/* Availability badge */}
            <motion.div {...FADE_UP[0]}>
              <motion.span
                whileHover={{ boxShadow: `0 0 40px ${theme.r35}, 0 0 80px ${theme.r35}` }}
                transition={{ duration: 0.3 }}
                className="badge-shine inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Available for work
              </motion.span>
            </motion.div>

            {/* Name */}
            <motion.div {...FADE_UP[1]}>
              <p className="text-[var(--text-2)] text-lg mb-1">Hello, I'm</p>
              <h1 className="font-syne font-bold text-5xl lg:text-7xl leading-tight">
                Ankit{" "}
                <span className="text-[var(--accent)]">Bhardwaj</span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.div {...FADE_UP[2]} className="flex flex-wrap items-center gap-2">
              <span className="badge-shine inline-flex items-center px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                Full-Stack Developer
              </span>
              <span className="badge-shine inline-flex items-center px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                Mobile Developer
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p {...FADE_UP[3]} className="text-[var(--text-2)] leading-relaxed max-w-md">
              4+ years building web and mobile products at scale. Clean code,
              scalable architecture, and a focus on performance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...FADE_UP[4]} className="flex flex-wrap gap-4 pt-2">
              <a
                href="#contact"
                className="font-syne font-bold bg-[var(--accent)] text-[#111111] px-6 py-3 rounded-lg hover:bg-[var(--accent-dark)] transition-colors"
              >
                Hire Me
              </a>
            </motion.div>
          </div>

          {/* Right column — Code Window */}
          <motion.div
            initial={CODE_WINDOW_ANIM.initial}
            animate={{
              ...CODE_WINDOW_ANIM.animate,
              opacity: closed ? 0 : 1,
              scale: closed ? 0.92 : 1,
              boxShadow: "0 0 0 rgba(0,0,0,0)",
            }}
            whileHover={closed ? undefined : { scale: 1.04, boxShadow: `0 0 40px ${theme.r35}, 0 0 80px ${theme.r35}` }}
            transition={closed ? { duration: 0.35, ease: "easeInOut" } : CODE_WINDOW_ANIM.transition}
            className="group bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden"
          >
            {/* Accent top border */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
            {/* Window chrome */}
            <div className="bg-[var(--code-chrome)] px-5 py-4 flex items-center gap-2 border-b border-[var(--border)]">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close code window"
                className="w-3 h-3 rounded-full bg-[#EF4444] flex items-center justify-center cursor-pointer hover:brightness-110 transition"
              >
                <IoIosClose color="#1A0000" className="w-2.5 h-2.5" aria-hidden="true" />
              </button>
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
              <span className="ml-3 text-xs text-[#8F8F84] font-mono">developer.js</span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy code"
                className="ml-auto flex items-center gap-1 text-xs text-[#8F8F84] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <IoCheckmarkOutline className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <IoCopyOutline className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            {/* Code */}
            <pre className="language-javascript line-numbers !m-0 !p-5 !text-[15px]">
              <code ref={codeRef} className="language-javascript" />
            </pre>
          </motion.div>

        </div>
      </section>

      <SectionDivider />

      <div id="about">
        <PortfolioPage />
      </div>
    </main>
  );
}
