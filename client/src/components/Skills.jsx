import { motion } from "framer-motion";
import { Code2, Database, Cloud, Cpu } from "lucide-react";
import {
  FaReact, FaNodeJs, FaGitAlt, FaLinux, FaGithub, FaGitlab,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPostgresql, SiMongodb,
  SiGraphql, SiJest, SiWebpack, SiRedux, SiFirebase, SiVercel, SiVite,
  SiVuedotjs, SiNestjs, SiExpress, SiCockroachlabs,
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

const HEADER_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const CARD_BORDER = { borderLeft: "3px solid #E8B84B" };
const CARD_HOVER = { scale: 1.03, boxShadow: "0 0 24px rgba(232, 184, 75, 0.35)" };

const skillCategories = [
  {
    Icon: Code2,
    title: "Frontend",
    skills: [
      { name: "React", SkillIcon: FaReact, color: "text-[#61DAFB]" },
      { name: "Vue.js", SkillIcon: SiVuedotjs, color: "text-[#4FC08D]" },
      { name: "React Native", SkillIcon: FaReact, color: "text-[#61DAFB]" },
      { name: "Next.js", SkillIcon: SiNextdotjs, color: "text-white" },
      { name: "TypeScript", SkillIcon: SiTypescript, color: "text-[#3178C6]" },
      { name: "Tailwind CSS", SkillIcon: SiTailwindcss, color: "text-[#38B2AC]" },
      { name: "CSS", SkillIcon: BsFileEarmarkCode, color: "text-[#1572B6]" },
      { name: "HTML", SkillIcon: BsFileEarmarkCode, color: "text-[#E34F26]" },
    ],
  },
  {
    Icon: Database,
    title: "Backend",
    skills: [
      { name: "Node.js", SkillIcon: FaNodeJs, color: "text-[#339933]" },
      { name: "Nest.js", SkillIcon: SiNestjs, color: "text-[#E0234E]" },
      { name: "Express", SkillIcon: SiExpress, color: "text-white" },
      { name: "PostgreSQL", SkillIcon: SiPostgresql, color: "text-[#336791]" },
      { name: "MongoDB", SkillIcon: SiMongodb, color: "text-[#47A248]" },
      { name: "CockroachDB", SkillIcon: SiCockroachlabs, color: "text-[#6933FF]" },
      { name: "GraphQL", SkillIcon: SiGraphql, color: "text-[#E10098]" },
      { name: "REST APIs", SkillIcon: BsGrid1X2, color: "text-[#FF6C37]" },
    ],
  },
  {
    Icon: Cloud,
    title: "Cloud & DevOps",
    skills: [
      { name: "CI/CD", SkillIcon: FcWorkflow, color: "" },
      { name: "Git", SkillIcon: FaGitAlt, color: "text-[#F05032]" },
      { name: "Linux", SkillIcon: FaLinux, color: "text-[#FCC624]" },
      { name: "GitHub", SkillIcon: FaGithub, color: "text-white" },
      { name: "GitLab", SkillIcon: FaGitlab, color: "text-orange-500" },
    ],
  },
  {
    Icon: Cpu,
    title: "Tools",
    skills: [
      { name: "VS Code", SkillIcon: TbBrandVscode, color: "text-[#007ACC]" },
      { name: "Firebase", SkillIcon: SiFirebase, color: "text-[#FFCA28]" },
      { name: "Vercel", SkillIcon: SiVercel, color: "text-white" },
      { name: "Vite", SkillIcon: SiVite, color: "text-[#646CFF]" },
      { name: "Webpack", SkillIcon: SiWebpack, color: "text-[#8DD6F9]" },
      { name: "Redux", SkillIcon: SiRedux, color: "text-[#764ABC]" },
      { name: "Jest", SkillIcon: SiJest, color: "text-[#C21325]" },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-16">
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
          {skillCategories.map(({ Icon, title, skills }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={CARD_HOVER}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6"
              style={CARD_BORDER}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-[#E8B84B]" aria-hidden="true" />
                <h3 className="font-syne font-bold text-white text-xl">{title}</h3>
              </div>
              <div className="border-t border-[#2A2A2A] pt-4 flex flex-wrap gap-2">
                {skills.map(({ name, SkillIcon, color }) => (
                  <motion.span
                    key={name}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 14px rgba(232, 184, 75, 0.45)",
                      borderColor: "rgba(232, 184, 75, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative flex items-center gap-1.5 bg-[#111111] border border-[#2A2A2A] text-[#888888] rounded-md px-3 py-1.5 text-sm overflow-hidden cursor-default group"
                  >
                    <SkillIcon className={`w-4 h-4 ${color} relative z-10`} aria-hidden="true" />
                    <span className="relative z-10">{name}</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
