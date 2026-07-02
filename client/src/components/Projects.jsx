import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import portfolioPreview from "../assets/images/portfolio-hero.png";
import vitanoPreview from "../assets/images/vitano-preview.png";
import utkarshPreview from "../assets/images/utkarsh-portfolio.png";
import odysseyPreview from "../assets/images/odyssey-hompage.png";
import { myGithub } from "../constants";
import { HEADER_ANIM, SUBHEADER_ANIM, CARD_BORDER, VIEWPORT_ONCE, cardVariantsSlow } from "../lib/animations";
import { useTheme } from "../lib/ThemeContext";

const projects = [
  {
    title: "Ankit's Portfolio",
    description:
      "This site itself — a full-stack monorepo, not a static template. A NestJS + Prisma API powers the blog's comments, likes, and JWT-gated admin panel, while the React frontend ships a canvas draw tool and three playable games. Deployed across Vercel, Render, and Neon.",
    tech: ["React", "Vite", "Nest.js", "Prisma", "PostgreSQL", "Tailwind CSS", "Framer Motion"],
    github: `${myGithub}/portfolio`,
    live: "https://bhardwajankit.com",
    image: portfolioPreview,
  },
  {
    title: "Odyssey",
    description:
      "A private portal for luxury travel — each trip gets its own branded page, shareable via QR code, with itineraries, flights, hotels, and experiences curated by the travel director. Built for Vagabond to replace static PDF itineraries with a living digital experience clients actually enjoy.",
    tech: ["Nest.js", "React.js", "Clerk", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Claude Code"],
    image: odysseyPreview,
  },
  {
    title: "Vitano",
    description:
      "A production landing page for an FMCG brand, built to turn visitors into buyers with a clean product showcase, category browsing, and a mobile-first layout. Live and actively used by the client to drive sales.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Google Reviews"],
    github: `${myGithub}/vitano`,
    live: "https://www.vitano.in",
    image: vitanoPreview,
  },
  {
    title: "Utkarsh Chaudhary — Portfolio",
    description:
      "A developer portfolio for a senior engineer specializing in scalable distributed systems and production AI. Bold typography, a minimal dark aesthetic, and smooth scroll-driven animations throughout.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "#",
    live: "https://www.utkarshch.com",
    image: utkarshPreview,
  },
];

export default function Projects() {
  const { theme } = useTheme();
  const cardHover = { scale: 1.03, boxShadow: `0 0 30px ${theme.r35}, 0 0 60px ${theme.r35}` };

  return (
    <section aria-labelledby="projects-heading" className="bg-[var(--bg)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 id="projects-heading" className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">03</span> — Projects
          </h2>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[var(--text-2)] italic mb-16">
          &ldquo;Things I&apos;ve built — and things worth building&rdquo;
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(({ title, description, tech, github, live, image }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={cardVariantsSlow}
              whileHover={cardHover}
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] flex flex-col overflow-hidden"
              style={CARD_BORDER}
            >
              {image && (
                <div className="h-44 overflow-hidden border-b border-[var(--border)]">
                  <img
                    src={image}
                    alt={`${title} preview`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-syne font-bold text-[var(--text-1)] text-xl mb-3">{title}</h3>

                <p className="text-[var(--text-2)] text-sm leading-relaxed mb-5">{description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text-2)] rounded-md px-3 py-1 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {(github || live) && (
                  <div className="border-t border-[var(--border)] pt-4 flex items-center gap-6 mt-auto">
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {live && (
                      <a
                        href={live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
