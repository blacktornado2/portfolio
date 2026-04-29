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
