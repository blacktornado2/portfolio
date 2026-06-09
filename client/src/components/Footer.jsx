import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { myEmail, myGithub, myLinkedIn } from "../constants";
import { useTheme, THEMES } from "../lib/ThemeContext";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-2" aria-label="Theme switcher">
      {Object.values(THEMES).map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          aria-label={`${t.label} theme`}
          title={`${t.label} theme`}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
            theme.name === t.name
              ? "ring-2 ring-offset-1 ring-offset-[#0D0D0D] scale-110"
              : "opacity-40 hover:opacity-80"
          }`}
          style={{ backgroundColor: t.accent }}
        />
      ))}
    </div>
  );
}

const SOCIALS = [
  { label: "GitHub", href: myGithub, Icon: FaGithub },
  { label: "LinkedIn", href: myLinkedIn, Icon: FaLinkedin },
  { label: "Email", href: `mailto:${myEmail}`, Icon: Mail },
];

const NAV = [
  { label: "About", href: "/#home" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#2A2A2A]">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-40)] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 lg:px-12 py-12"
      >
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">

          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-syne font-bold text-white text-lg">Ankit Bhardwaj</p>
            <p className="text-[#555555] text-sm mt-1">Full-Stack · Mobile Developer</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[#555555] hover:text-[var(--accent)] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#555555] hover:text-[var(--accent)] hover:border-[var(--accent-40)] transition-colors"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#2A2A2A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-[#444444]">
            © {new Date().getFullYear()} Ankit Bhardwaj. All rights reserved.
          </p>
          <ThemeSwitcher />
          <p className="font-mono text-[11px] text-[#444444]">
            Built with{" "}
            <span className="text-[var(--accent-70)]">React</span>
            {" · "}
            <span className="text-[var(--accent-70)]">NestJS</span>
            {" · "}
            <span className="text-[var(--accent-70)]">PostgreSQL</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
