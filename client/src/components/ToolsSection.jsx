import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Calculator, PenTool } from "lucide-react";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";
import { useTheme } from "../lib/ThemeContext";

const tools = [
  {
    id: "games",
    title: "Games",
    tag: "Play",
    icon: Gamepad2,
    description: "Browser builds of classic puzzles and a code-snippet typing race. No installs, no accounts.",
    items: ["2048", "Wordle", "TypeRacer"],
    path: "/games",
    cta: "Play now",
  },
  {
    id: "calculators",
    title: "Calculators",
    tag: "Finance",
    icon: Calculator,
    description: "Loan and investment calculators with year-by-year charts and full schedules.",
    items: ["EMI", "Loan Tenure", "SIP + Step-up"],
    path: "/calculators",
    cta: "Run the numbers",
  },
  {
    id: "draw",
    title: "Draw",
    tag: "Create",
    icon: PenTool,
    description: "A canvas for quick diagrams, wireframes and doodles. Saves as you go, exports to PNG.",
    items: ["Pencil & shapes", "Text", "PNG export"],
    path: "/draw",
    cta: "Start drawing",
  },
];

export default function ToolsSection() {
  const { theme } = useTheme();

  return (
    <section aria-labelledby="tools-heading" className="bg-[var(--bg)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 id="tools-heading" className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">05</span> — Tools
          </h2>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[var(--text-2)] italic mb-16">
          &ldquo;Small things I built because I wanted them to exist.&rdquo;
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {tools.map(({ id, title, tag, icon: Icon, description, items, path, cta }, i) => (
            <motion.div
              key={id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-xl"
                initial={{ boxShadow: `0 0 0px ${theme.r0}` }}
                whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${theme.r45}`, zIndex: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={path} className="group flex flex-col p-6 h-full gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[var(--accent-25)] bg-[var(--accent-10)] text-[var(--accent)]">
                      {tag}
                    </span>
                    <Icon
                      className="w-5 h-5 text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors duration-150"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-syne font-bold text-2xl text-[var(--accent)] tracking-tight group-hover:text-[var(--text-1)] transition-colors duration-150">
                    {title}
                  </h3>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">{description}</p>
                  <ul className="flex flex-wrap gap-1.5 flex-1 content-start">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--border)] text-[var(--text-2)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors duration-150 pt-3 border-t border-[var(--border)]">
                    {cta} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
