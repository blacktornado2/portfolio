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
import { HEADER_ANIM, CARD_BORDER, VIEWPORT_ONCE, cardVariants } from "../lib/animations";
import { useTheme } from "../lib/ThemeContext";

const skillCategories = [
  {
    Icon: Code2,
    title: "Frontend",
    skills: [
      { name: "React", SkillIcon: FaReact, color: "text-[#61DAFB]" },
      { name: "Vue.js", SkillIcon: SiVuedotjs, color: "text-[#4FC08D]" },
      { name: "React Native", SkillIcon: FaReact, color: "text-[#61DAFB]" },
      { name: "Next.js", SkillIcon: SiNextdotjs, color: "text-[var(--text-1)]" },
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
      { name: "Express", SkillIcon: SiExpress, color: "text-[var(--text-1)]" },
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
      { name: "GitHub", SkillIcon: FaGithub, color: "text-[var(--text-1)]" },
      { name: "GitLab", SkillIcon: FaGitlab, color: "text-orange-500" },
    ],
  },
  {
    Icon: Cpu,
    title: "Tools",
    skills: [
      { name: "VS Code", SkillIcon: TbBrandVscode, color: "text-[#007ACC]" },
      { name: "Firebase", SkillIcon: SiFirebase, color: "text-[#FFCA28]" },
      { name: "Vercel", SkillIcon: SiVercel, color: "text-[var(--text-1)]" },
      { name: "Vite", SkillIcon: SiVite, color: "text-[#646CFF]" },
      { name: "Webpack", SkillIcon: SiWebpack, color: "text-[#8DD6F9]" },
      { name: "Redux", SkillIcon: SiRedux, color: "text-[#764ABC]" },
      { name: "Jest", SkillIcon: SiJest, color: "text-[#C21325]" },
    ],
  },
];

export default function SkillsSection() {
  const { theme } = useTheme();
  const cardHover = { scale: 1.03, boxShadow: `0 0 24px ${theme.r35}` };

  return (
    <section aria-labelledby="skills-heading" className="bg-[var(--bg)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-3">
          <h2 id="skills-heading" className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">06</span> — Skills
          </h2>
        </motion.div>

        {/* Icon cloud */}
        <div className="flex justify-center mb-4">
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
              viewport={VIEWPORT_ONCE}
              variants={cardVariants}
              whileHover={cardHover}
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6"
              style={CARD_BORDER}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="font-syne font-bold text-[var(--text-1)] text-xl">{title}</h3>
              </div>
              <div className="border-t border-[var(--border)] pt-4 flex flex-wrap gap-2">
                {skills.map(({ name, SkillIcon, color }) => (
                  <motion.span
                    key={name}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: `0 0 14px ${theme.r45}`,
                      borderColor: theme.r50,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-2)] rounded-md px-3 py-1.5 text-sm overflow-hidden cursor-default group"
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
