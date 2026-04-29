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
        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
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
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
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
