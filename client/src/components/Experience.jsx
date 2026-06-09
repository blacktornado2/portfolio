import { motion } from "framer-motion";
import { HEADER_ANIM, SUBHEADER_ANIM, CARD_BORDER, VIEWPORT_ONCE, cardVariants } from "../lib/animations";
import { useTheme } from "../lib/ThemeContext";

const experiences = [
  {
    title: "Software Engineer II",
    company: "BetterWorks",
    period: "2025 – Present",
    description:
      "Building performance management features on a Nest.js + Vue.js stack for enterprise teams worldwide.",
  },
  {
    title: "Software Developer — 1",
    company: "one.com",
    period: "2023 – 2025",
    description:
      "Owned frontend of one.com's companion super app — bringing multiple products together into one seamless experience.",
  },
  {
    title: "Associate Software Developer",
    company: "one.com",
    period: "2022 – 2023",
    description:
      "Optimised DB queries, wired up APIs, and gradually took ownership of entire backend modules.",
  },
];

export default function ExperienceSection() {
  const { theme } = useTheme();
  const cardHover = { scale: 1.05, boxShadow: `0 0 24px ${theme.r35}` };

  return (
    <section aria-labelledby="experience-heading" className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 id="experience-heading" className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[var(--accent)]">02</span> — Professional Journey
          </h2>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[#888888] italic mb-16">
          "Transforming ideas into digital reality, one project at a time"
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map(({ title, company, period, description }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={cardVariants}
              whileHover={cardHover}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6"
              style={CARD_BORDER}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                <h3 className="font-syne font-bold text-white text-xl leading-snug">
                  {title}
                </h3>
                <span className="text-xs text-[#888888] bg-[#111111] border border-[#2A2A2A] px-3 py-1 rounded-md whitespace-nowrap self-start">
                  {period}
                </span>
              </div>
              <p className="text-[var(--accent)] text-sm font-medium mb-4">{company}</p>
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
