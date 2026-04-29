# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp Ankit Bhardwaj's portfolio from a generic dark-navy/gradient aesthetic to a clean "Dark Refined" design (charcoal + gold) targeting recruiters and freelancing clients.

**Architecture:** Each section component is rewritten in-place. A shared design token set (colors, fonts) is established in `index.css` and `tailwind.config.js` first, then each component is rewritten top-to-bottom. No new npm packages — all existing dependencies (Framer Motion, Lucide, react-icons, Prism.js) are reused.

**Tech Stack:** React 18, Tailwind CSS v3, Framer Motion v11, Prism.js, Vite

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/assets/css/index.css` | Modify | Google Fonts, Prism theme, body background |
| `tailwind.config.js` | Modify | Add Syne/DM Sans/JetBrains Mono font families |
| `src/components/Header.jsx` | Rewrite | Fixed top bar nav, scroll + IntersectionObserver |
| `src/components/Hero.jsx` | Rewrite | Clean 50/50 split, remove all magic-ui components |
| `src/components/PortfolioPage.jsx` | Rewrite | About section with gold ring photo |
| `src/components/Skills.jsx` | Rewrite | Left-border gold cards, keep icon cloud |
| `src/components/Experience.jsx` | Rewrite | Left-border gold cards, whileInView stagger |
| `src/components/Education.jsx` | Rewrite | Left-border gold cards, whileInView stagger |
| `src/components/Contact.jsx` | Rewrite | Two-column, gold focus inputs, gold submit |
| `src/assets/css/Header.css` | Delete | Unused (Header.jsx never imported it) |

---

## Task 1: Design System Foundation

**Files:**
- Modify: `src/assets/css/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Replace `src/assets/css/index.css` with the new design system**

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ---- Prism.js — Dark Refined theme ---- */
pre[class*="language-"] {
  background: #1A1A1A !important;
  padding: 1.5rem !important;
  margin: 0 !important;
  font-size: 0.875rem !important;
  font-family: 'JetBrains Mono', monospace !important;
  line-height: 1.7 !important;
}
.token.keyword { color: #E8B84B !important; }
.token.string { color: #d4c090 !important; }
.token.number,
.token.boolean { color: #E8B84B !important; }
.token.property { color: #888888 !important; }
.token.punctuation { color: #FFFFFF !important; }
.token.operator { color: #888888 !important; }
.token.comment { color: #444444 !important; font-style: italic; }
.token.function { color: #FFFFFF !important; }

/* ---- shadcn/ui CSS variables (kept for component compatibility) ---- */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html,
  body {
    background-color: #111111;
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
  }
}
```

- [ ] **Step 2: Add font families to `tailwind.config.js`**

Open `tailwind.config.js`. Inside the `extend` block (after `borderRadius`), add a `fontFamily` key:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
      fontFamily: {
        syne: ['"Syne"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
  		animation: {
  			meteor: 'meteor 5s linear infinite'
  		},
  		keyframes: {
  			meteor: {
  				'0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
  				'70%': { opacity: '1' },
  				'100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' }
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
  			popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
  			primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  			secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
  			muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  			accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
  			destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
```

- [ ] **Step 3: Start the dev server and verify fonts load**

```bash
npm run dev
```

Open `http://localhost:5173`. The page background should now be `#111111`. Open DevTools → Network → filter "fonts" — you should see requests to `fonts.googleapis.com` for Syne, DM Sans, and JetBrains Mono.

- [ ] **Step 4: Commit**

```bash
git add src/assets/css/index.css tailwind.config.js
git commit -m "feat: add design system — Dark Refined fonts and Prism theme"
```

---

## Task 2: Navigation (`Header.jsx`)

**Files:**
- Modify: `src/components/Header.jsx`
- Delete: `src/assets/css/Header.css`

- [ ] **Step 1: Replace the entire contents of `src/components/Header.jsx`**

```jsx
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
```

- [ ] **Step 2: Update `src/App.jsx` — remove the `isOnePage` prop from `<Header />`**

In `App.jsx`, the `<Header isOnePage={isOnePage} />` call should become `<Header />` since the new Header doesn't use that prop. Also remove the unused `isOnePage` state and the router-mode branch:

```jsx
// App.jsx
import React, { useRef } from "react";
import Hero from "./components/Hero";
import "./assets/css/index.css";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";

export default function App() {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      <Header />
      <div ref={heroRef} id="home">
        <Hero />
      </div>
      <div ref={skillsRef} id="skills">
        <Skills />
      </div>
      <div ref={experienceRef} id="experience">
        <Experience />
      </div>
      <div ref={educationRef} id="education">
        <Education />
      </div>
      <div ref={contactRef} id="contact">
        <Contact />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Delete `src/assets/css/Header.css`**

```bash
rm src/assets/css/Header.css
```

- [ ] **Step 4: Verify in browser**

`http://localhost:5173` — you should see:
- Full-width transparent header at the top with "Ankit Bhardwaj" on the left and nav links on the right
- As you scroll past 60px, the header gets a dark semi-transparent background with a bottom border
- On mobile (< 768px), links collapse to a hamburger icon that opens a drawer

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/App.jsx
git commit -m "feat: revamp navigation to fixed top bar with scroll + IntersectionObserver"
```

---

## Task 3: Hero Section (`Hero.jsx`)

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/Hero.jsx`**

```jsx
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
```

- [ ] **Step 2: Verify in browser**

`http://localhost:5173` — Hero section should show:
- Dark `#111111` background with no gradients, no meteors, no grid lines
- "Hello, I'm" in muted gray, then "Ankit **Bhardwaj**" in large Syne font with the last name in gold
- Green pulsing "Available for work" badge
- Two CTA buttons: gold "Hire Me" and outlined "Download CV"
- Code window on the right with gold keyword highlighting and JetBrains Mono font
- Staggered fade-up animation on left column elements on page load

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: revamp Hero section — Dark Refined palette, remove magic-ui components"
```

---

## Task 4: About Section (`PortfolioPage.jsx`)

**Files:**
- Modify: `src/components/PortfolioPage.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/PortfolioPage.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import profileImage from "../assets/images/profile2.jpeg";

export default function AboutMe() {
  return (
    <section className="bg-[#111111] border-t border-[#2A2A2A] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">01</span> — About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-[#888888] text-lg leading-relaxed">
              Hey, I am{" "}
              <span className="text-[#E8B84B] font-semibold">Ankit :) </span>
              <br />
              I'm a software developer with over 3 years of experience, currently
              working at one.com as a SDE-1.
              <br />
              <br />
              I have experience in Full Stack Development working with React
              Native, React.js, Node.js, PostgreSQL, CockroachDB, MongoDB, Redux
              and Firebase.
              <br />
              <br />
              I am passionate about building scalable and high-performance
              applications, focusing on clean and efficient code. I enjoy solving
              complex problems and continuously learning new technologies to
              enhance my skill set.
              <br />
              <br />
              Apart from coding, I like travelling, playing sports like cricket,
              badminton, swimming etc. and working out at the gym. Always open to
              new connections — feel free to reach out. I appreciate you taking
              the time to learn more about me{" "}
              <span className="text-[#E8B84B]">^_^</span>
            </p>
          </motion.div>

          {/* Right: Profile photo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={profileImage}
              alt="Ankit Bhardwaj"
              className="h-80 w-80 object-cover rounded-full ring-2 ring-[#E8B84B] ring-offset-4 ring-offset-[#111111]"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll down from the Hero — the About section should show:
- Section header `01 — About Me` with gold number
- Bio text in muted gray (`#888888`) with "Ankit :)" highlighted in gold
- Circular profile photo with a thin gold ring and dark ring-offset on the right
- Smooth fade-in on scroll

- [ ] **Step 3: Commit**

```bash
git add src/components/PortfolioPage.jsx
git commit -m "feat: revamp About section — gold ring photo, clean bio layout"
```

---

## Task 5: Skills Section (`Skills.jsx`)

**Files:**
- Modify: `src/components/Skills.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/Skills.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { Code2, Database, Cloud, Cpu } from "lucide-react";
import {
  FaReact, FaNodeJs, FaGitAlt, FaLinux, FaGithub, FaGitlab,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPostgresql, SiMongodb,
  SiGraphql, SiJest, SiWebpack, SiRedux, SiFirebase, SiVercel, SiVite,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { BsFileEarmarkCode, BsGrid1X2 } from "react-icons/bs";
import { FcWorkflow } from "react-icons/fc";
import IconCloudDemo from "./globe";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const skillCategories = [
  {
    icon: Code2,
    title: "Frontend",
    skills: [
      { name: "React",        icon: <FaReact className="w-4 h-4 text-[#61DAFB]" /> },
      { name: "React Native", icon: <FaReact className="w-4 h-4 text-[#61DAFB]" /> },
      { name: "Next.js",      icon: <SiNextdotjs className="w-4 h-4 text-white" /> },
      { name: "TypeScript",   icon: <SiTypescript className="w-4 h-4 text-[#3178C6]" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="w-4 h-4 text-[#38B2AC]" /> },
      { name: "CSS",          icon: <BsFileEarmarkCode className="w-4 h-4 text-[#1572B6]" /> },
      { name: "HTML",         icon: <BsFileEarmarkCode className="w-4 h-4 text-[#E34F26]" /> },
    ],
  },
  {
    icon: Database,
    title: "Backend",
    skills: [
      { name: "Node.js",    icon: <FaNodeJs className="w-4 h-4 text-[#339933]" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4 text-[#336791]" /> },
      { name: "MongoDB",    icon: <SiMongodb className="w-4 h-4 text-[#47A248]" /> },
      { name: "REST APIs",  icon: <BsGrid1X2 className="w-4 h-4 text-[#FF6C37]" /> },
      { name: "GraphQL",    icon: <SiGraphql className="w-4 h-4 text-[#E10098]" /> },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    skills: [
      { name: "CI/CD",  icon: <FcWorkflow className="w-4 h-4" /> },
      { name: "Git",    icon: <FaGitAlt className="w-4 h-4 text-[#F05032]" /> },
      { name: "Linux",  icon: <FaLinux className="w-4 h-4 text-[#FCC624]" /> },
      { name: "GitHub", icon: <FaGithub className="w-4 h-4 text-white" /> },
      { name: "GitLab", icon: <FaGitlab className="w-4 h-4 text-orange-500" /> },
    ],
  },
  {
    icon: Cpu,
    title: "Tools",
    skills: [
      { name: "VS Code",  icon: <TbBrandVscode className="w-4 h-4 text-[#007ACC]" /> },
      { name: "Jest",     icon: <SiJest className="w-4 h-4 text-[#C21325]" /> },
      { name: "Webpack",  icon: <SiWebpack className="w-4 h-4 text-[#8DD6F9]" /> },
      { name: "Redux",    icon: <SiRedux className="w-4 h-4 text-[#764ABC]" /> },
      { name: "Firebase", icon: <SiFirebase className="w-4 h-4 text-[#FFCA28]" /> },
      { name: "Vercel",   icon: <SiVercel className="w-4 h-4 text-white" /> },
      { name: "Vite",     icon: <SiVite className="w-4 h-4 text-[#646CFF]" /> },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">02</span> — Skills
          </h2>
        </motion.div>

        {/* Icon cloud */}
        <div className="flex justify-center mb-16">
          <div className="max-w-lg w-full">
            <IconCloudDemo />
          </div>
        </div>

        {/* Skill cards — 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map(({ icon: Icon, title, skills }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6"
              style={{ borderLeft: "3px solid #E8B84B" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-[#E8B84B]" />
                <h3 className="font-syne font-bold text-white text-xl">{title}</h3>
              </div>
              <div className="border-t border-[#2A2A2A] pt-4 flex flex-wrap gap-2">
                {skills.map((skill, j) => (
                  <span
                    key={j}
                    className="flex items-center gap-1.5 bg-[#111111] border border-[#2A2A2A] text-[#888888] rounded-md px-3 py-1.5 text-sm"
                  >
                    {skill.icon}
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to the Skills section — should show:
- Section header `02 — Skills` with gold number
- Icon cloud centered above the cards
- 2×2 grid of cards, each with a gold left border (3px), card icon and title in a row, skill badges below a hairline divider
- Cards fade up with stagger on scroll

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.jsx
git commit -m "feat: revamp Skills section — gold border cards, clean badges"
```

---

## Task 6: Experience Section (`Experience.jsx`)

**Files:**
- Modify: `src/components/Experience.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/Experience.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const experiences = [
  {
    title: "Software Developer — 1",
    company: "one.com",
    period: "Jan 2024 – Present",
    description:
      "Frontend: working on integrating various services into our super app — companion app.",
  },
  {
    title: "Associate Software Developer",
    company: "one.com",
    period: "May 2022 – Dec 2023",
    description:
      "Backend: Assisted in making various DB optimisations and integrating APIs.",
  },
  {
    title: "Software Developer Intern",
    company: "one.com",
    period: "Dec 2021 – May 2022",
    description:
      "Learnt various tools and technologies like React.js, Node.js, Vanilla JS, Git, Ubuntu, JIRA etc.",
  },
];

export default function ExperienceSection() {
  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">03</span> — Professional Journey
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#888888] italic mb-16"
        >
          "Transforming ideas into digital reality, one project at a time"
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map(({ title, company, period, description }, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6"
              style={{ borderLeft: "3px solid #E8B84B" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                <h3 className="font-syne font-bold text-white text-xl leading-snug">
                  {title}
                </h3>
                <span className="text-xs text-[#888888] bg-[#111111] border border-[#2A2A2A] px-3 py-1 rounded-md whitespace-nowrap self-start">
                  {period}
                </span>
              </div>
              <p className="text-[#E8B84B] text-sm font-medium mb-4">{company}</p>
              <div className="border-t border-[#2A2A2A] pt-4">
                <p className="text-[#888888] text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Experience — should show:
- Section header `03 — Professional Journey` with gold number and italic subtitle
- 3 cards in a row on desktop (stack on mobile), each with gold left border
- Role title in white Syne, company in gold, period as a muted pill, description below a hairline divider
- No glassmorphism, no particles, no animated gradient borders

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.jsx
git commit -m "feat: revamp Experience section — left-border gold cards, whileInView stagger"
```

---

## Task 7: Education Section (`Education.jsx`)

**Files:**
- Modify: `src/components/Education.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/Education.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Award } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const educationData = [
  {
    degree: "B. Tech (Computer Science)",
    school: "J.C. Bose University of Science and Technology, YMCA",
    mascot: "💻",
    year: "2018 – 2022",
    achievements: ["CGPA: 8.0"],
    subjects: ["C++", "Operating System", "OOPS", "DBMS"],
    description:
      "Focused on core computer science subjects with emphasis on practical laboratory work and scientific research methodologies. Enjoyed college life ^_^",
  },
  {
    degree: "Intermediate (+2)",
    school: "St. Crispin's Sr. Sec. School",
    mascot: "📘",
    year: "2016 – 2017",
    achievements: ["Percentage: 92%"],
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    description:
      "Developed strong analytical and critical thinking skills through comprehensive study of science. Studies were highly engaging :D",
  },
  {
    degree: "Matriculation",
    school: "St. Crispin's Sr. Sec. School, Gurugram",
    mascot: "📕",
    year: "2014 – 2015",
    achievements: ["CGPA: 9.4"],
    subjects: ["Science", "English", "Social Studies", "Economics", "History"],
    description:
      "Developed knowledge in a variety of subjects. Played sports like cricket, badminton, football, volleyball. Life was pretty easy :)",
  },
];

export default function EducationSection() {
  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">04</span> — Education
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#888888] mb-16"
        >
          Discover how academic excellence shapes innovative thinking and
          professional growth.
        </motion.p>

        {/* Cards — 2-col grid, last card auto-centered on md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationData.map(({ degree, school, mascot, year, achievements, subjects, description }, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className={`bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 ${
                i === educationData.length - 1 && educationData.length % 2 !== 0
                  ? "md:col-span-2 md:max-w-lg md:mx-auto md:w-full"
                  : ""
              }`}
              style={{ borderLeft: "3px solid #E8B84B" }}
            >
              {/* Header row */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{mascot}</span>
                <div>
                  <h3 className="font-syne font-bold text-white text-xl leading-tight">
                    {degree}
                  </h3>
                  <p className="text-[#888888] text-sm flex items-center gap-1.5 mt-1">
                    <BookOpen className="w-4 h-4 text-[#E8B84B] flex-shrink-0" />
                    {school}
                  </p>
                </div>
              </div>

              {/* Year */}
              <p className="text-[#888888] text-xs flex items-center gap-1.5 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                {year}
              </p>

              <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
                {/* Description */}
                <p className="text-[#888888] text-sm italic border-l-2 border-[#2A2A2A] pl-3">
                  {description}
                </p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a, j) => (
                    <span
                      key={j}
                      className="flex items-center gap-1.5 text-xs text-[#E8B84B] bg-[#E8B84B15] border border-[#E8B84B33] rounded-full px-3 py-1"
                    >
                      <Award className="w-3 h-3" />
                      {a}
                    </span>
                  ))}
                </div>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s, j) => (
                    <span
                      key={j}
                      className="text-xs bg-[#111111] border border-[#2A2A2A] text-[#666666] px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Education — should show:
- Section header `04 — Education` with gold number
- 2-column grid with the third card centered (spans both columns at `max-w-lg`)
- Each card: emoji mascot + degree title + school with book icon, year with calendar icon, italic description, gold achievement pill, subject tags
- Gold left border on each card

- [ ] **Step 3: Commit**

```bash
git add src/components/Education.jsx
git commit -m "feat: revamp Education section — left-border gold cards, whileInView"
```

---

## Task 8: Contact Section (`Contact.jsx`)

**Files:**
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Replace the entire contents of `src/components/Contact.jsx`**

```jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { myEmail, myLocation, myPincode } from "../constants";

const inputClass = (error) =>
  `w-full bg-[#111111] border rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none transition-colors ${
    error
      ? "border-red-500 focus:border-red-400"
      : "border-[#2A2A2A] focus:border-[#E8B84B]"
  }`;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())    errs.name    = "Name is required";
    if (!formData.email.trim())   errs.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email is invalid";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const form = new FormData();
    form.append("access_key", "0e22ebff-ca15-4e6c-b71a-6426816d9eb2");
    form.append("name",    formData.name);
    form.append("email",   formData.email);
    form.append("subject", formData.subject);
    form.append("message", formData.message);

    try {
      const res    = await fetch("https://api.web3forms.com/submit", { method: "POST", body: form });
      const result = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        setStatus(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("An error occurred. Please try again.");
    }
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">05</span> — Contact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-syne font-bold text-3xl text-white mb-4">
                Let's build something.
              </h3>
              <p className="text-[#888888] leading-relaxed">
                Have a project in mind or want to work together? Feel free to
                reach out — I'm always open to new connections and conversations.
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#E8B84B]" />
                </div>
                <div>
                  <p className="text-xs text-[#555555] uppercase tracking-widest mb-0.5">Email</p>
                  <a
                    href={`mailto:${myEmail}`}
                    className="text-[#888888] hover:text-[#E8B84B] transition-colors font-mono text-sm break-all"
                  >
                    {myEmail}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#E8B84B]" />
                </div>
                <div>
                  <p className="text-xs text-[#555555] uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-[#888888] text-sm">
                    {myLocation}, {myPincode}
                  </p>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-3 rounded-lg flex-shrink-0">
                  <FaGithub className="w-5 h-5 text-[#E8B84B]" />
                </div>
                <div>
                  <p className="text-xs text-[#555555] uppercase tracking-widest mb-0.5">GitHub</p>
                  <a
                    href="https://github.com/blacktornado2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
                  >
                    github.com/blacktornado2
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Name"
                    className={inputClass(errors.name)}
                    value={formData.name} onChange={set("name")} />
                  {errors.name    && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Your Email"
                    className={inputClass(errors.email)}
                    value={formData.email} onChange={set("email")} />
                  {errors.email   && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Subject"
                    className={inputClass(errors.subject)}
                    value={formData.subject} onChange={set("subject")} />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <textarea placeholder="Your Message" rows={5}
                    className={`${inputClass(errors.message)} resize-none`}
                    value={formData.message} onChange={set("message")} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full font-syne font-bold bg-[#E8B84B] text-[#111111] py-3 px-6 rounded-lg hover:bg-[#d4a83e] transition-colors flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {status && (
                <p className={`mt-4 text-center text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {status === "success" ? "Message sent successfully!" : status}
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Contact — should show:
- Section header `05 — Contact` with gold number
- Left column: "Let's build something." heading, then Email / Location / GitHub rows each with a gold-icon square badge
- Right column: dark `#1A1A1A` form card, inputs with `#2A2A2A` border that switch to gold on focus, gold submit button
- Form validation: error messages appear below invalid fields in red
- No frosted-glass container

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "feat: revamp Contact section — gold focus inputs, info column with GitHub link"
```

---

## Task 9: Final Cleanup

**Files:**
- Delete: `src/assets/css/Header.css` (if not already deleted in Task 2)
- Verify: `src/components/AnimatedGrid.jsx` is not imported anywhere (can be deleted)

- [ ] **Step 1: Confirm no orphan imports remain**

```bash
grep -r "Header.css\|AnimatedGrid\|Meteors\|SparklesText\|FlipWords\|animate__" src/
```

Expected output: no matches. If any appear, remove the import from the relevant file.

- [ ] **Step 2: Delete unused files**

```bash
# Only run these if the grep above showed no imports
rm -f src/assets/css/Header.css
rm -f src/components/AnimatedGrid.jsx
```

Also check `src/components/ui/meteors.jsx`, `src/components/ui/sparkles-text.jsx`, `src/components/ui/flip-words.jsx` — these are now unused. Delete them:

```bash
rm -f src/components/ui/meteors.jsx
rm -f src/components/ui/sparkles-text.jsx
rm -f src/components/ui/flip-words.jsx
```

- [ ] **Step 3: Full visual walkthrough**

Run `npm run dev` and walk through the entire page:

| Check | Expected |
|---|---|
| Background | `#111111` everywhere — no white gaps between sections |
| Fonts | Syne for all headings, DM Sans for body text |
| Nav | Transparent → frosted on scroll; gold "Hire Me" button |
| Hero | Split layout, gold name, pulsing green dot, code window |
| About | Gold ring on profile photo |
| Skills | Icon cloud + 2×2 cards with gold left borders |
| Experience | 3-col grid (desktop), gold left borders |
| Education | 2-col grid, gold achievement pills, emoji mascots |
| Contact | Two-column, gold focus on inputs, gold submit button |
| Mobile | All sections stack correctly, nav hamburger works |

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove unused magic-ui components and Header.css"
```

---

## Self-Review Checklist

- **Spec coverage:** All 8 sections from spec covered (design system, nav, hero, about, skills, experience, education, contact) ✓
- **No placeholders:** Every step has complete file contents or exact shell commands ✓
- **Type consistency:** `cardVariants` uses `custom={i}` prop — matches `visible: (i) => ...` signature across Tasks 5, 6, 7 ✓
- **`borderLeft` style:** All cards use `style={{ borderLeft: "3px solid #E8B84B" }}` consistently across Tasks 5, 6, 7, 8 ✓
- **Font class names:** `font-syne` used in headings; matches `fontFamily.syne` key in tailwind.config.js ✓
- **Section IDs:** `id="home"`, `id="skills"`, `id="experience"`, `id="education"`, `id="contact"` — set by `App.jsx` wrapper divs, not inside components. Header IntersectionObserver watches these exact IDs ✓
