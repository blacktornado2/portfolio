import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const HEADER_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const SUBHEADER_ANIM = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.1 },
};

const CARD_BORDER = { borderLeft: "3px solid #E8B84B" };
const CARD_HOVER = { scale: 1.05, boxShadow: "0 0 24px rgba(232, 184, 75, 0.35)" };
const VIEWPORT_ONCE = { once: true };

const experiences = [
  {
    title: "Software Engineer II",
    company: "BetterWorks",
    period: "Nov 2025 – Present",
    description:
      "Building performance management features on a Nest.js + Vue.js stack for enterprise teams worldwide.",
  },
  {
    title: "Software Developer — 1",
    company: "one.com",
    period: "Jan 2024 – Aug 2025",
    description:
      "Owned frontend of one.com's companion super app — bringing multiple products together into one seamless experience.",
  },
  {
    title: "Associate Software Developer",
    company: "one.com",
    period: "May 2022 – Dec 2023",
    description:
      "Optimised DB queries, wired up APIs, and gradually took ownership of entire backend modules.",
  },
];

export default function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading" className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 id="experience-heading" className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">03</span> — Professional Journey
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
              whileHover={CARD_HOVER}
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
