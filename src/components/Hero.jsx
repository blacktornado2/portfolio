import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import { motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import PortfolioPage from "./PortfolioPage";

const CODE = `const profile = {
    name: 'Ankit Bhardwaj',
    title: 'Full-Stack Developer',
    skills: [
        'React Native', 'React.js',
        'Node.js', 'TypeScript',
        'MongoDB', 'PostgreSQL',
    ],
    experience: '3+ years',
    open: true,
};`;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Hero() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <main className="bg-[#111111] text-white">
      {/* ── Hero section ── */}
      <section className="min-h-screen flex items-center px-6 lg:px-12 pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16">

          {/* Left column */}
          <div className="space-y-6">
            {/* Availability badge */}
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#888888]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Available for work
              </span>
            </motion.div>

            {/* Name */}
            <motion.div {...fadeUp(0.2)}>
              <p className="text-[#888888] text-lg mb-1">Hello, I'm</p>
              <h1 className="font-syne font-bold text-5xl lg:text-7xl leading-tight">
                Ankit{" "}
                <span className="text-[#E8B84B]">Bhardwaj</span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.p {...fadeUp(0.3)} className="text-[#888888] text-xl">
              Full-Stack Developer · React Native · Node.js
            </motion.p>

            {/* Bio */}
            <motion.p {...fadeUp(0.4)} className="text-[#888888] leading-relaxed max-w-md">
              3+ years building web and mobile products at scale. Clean code,
              scalable architecture, and a focus on performance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4 pt-2">
              <a
                href="#contact"
                className="font-syne font-bold bg-[#E8B84B] text-[#111111] px-6 py-3 rounded-lg hover:bg-[#d4a83e] transition-colors"
              >
                Hire Me
              </a>
              <a
                href="#"
                className="border border-[#2A2A2A] text-[#888888] px-6 py-3 rounded-lg hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors"
              >
                Download CV
              </a>
            </motion.div>
          </div>

          {/* Right column — Code Window */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="bg-[#161616] px-4 py-3 flex items-center gap-2 border-b border-[#2A2A2A]">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] flex items-center justify-center">
                  <IoIosClose color="#1A0000" className="w-2.5 h-2.5" />
                </span>
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="ml-3 text-xs text-[#555555] font-mono">developer.js</span>
              </div>
              {/* Code */}
              <pre className="language-javascript !m-0">
                <code className="language-javascript">{CODE}</code>
              </pre>
            </div>
          </motion.div>

        </div>
      </section>

      <PortfolioPage />
    </main>
  );
}
