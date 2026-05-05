import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
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

const projects = [
  {
    title: "DevTrack",
    description:
      "A real-time developer task management platform with Kanban boards, team collaboration, and sprint planning. Built to handle high concurrency with WebSocket-powered live updates.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Socket.io"],
    github: "#",
    live: "#",
  },
  {
    title: "ShopFlow",
    description:
      "A cross-platform mobile e-commerce app with a seamless checkout experience, push notifications, and real-time inventory sync. Integrated Stripe for secure payments.",
    tech: ["React Native", "Node.js", "MongoDB", "Stripe", "Firebase"],
    github: "#",
    live: "#",
  },
];

export default function Projects() {
  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">04</span> — Projects
          </h2>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[#888888] italic mb-16">
          "Things I've built — and things worth building"
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(({ title, description, tech, github, live }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 flex flex-col"
              style={CARD_BORDER}
            >
              <h3 className="font-syne font-bold text-white text-xl mb-3">{title}</h3>

              <p className="text-[#888888] text-sm leading-relaxed mb-5">{description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="bg-[#111111] border border-[#2A2A2A] text-[#888888] rounded-md px-3 py-1 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="border-t border-[#2A2A2A] pt-4 flex items-center gap-6 mt-auto">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#E8B84B] transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#E8B84B] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
