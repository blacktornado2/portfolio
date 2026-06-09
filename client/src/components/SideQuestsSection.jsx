import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HEADER_ANIM, SUBHEADER_ANIM } from "../lib/animations";


const games = [
  {
    id: "2048",
    title: "2048",
    tag: "Puzzle",
    description: "Slide tiles and combine them to reach 2048. Deceptively simple, endlessly replayable.",
    path: "/games/2048",
  },
  {
    id: "wordle",
    title: "Wordle",
    tag: "Word",
    description: "Six attempts to crack a hidden 5-letter word. One colour-coded guess at a time.",
    path: "/games/wordle",
  },
  {
    id: "typeracer",
    title: "TypeRacer",
    tag: "Speed",
    description: "Type a passage as fast as you can. See how your WPM stacks up under pressure.",
    path: "/games/typeracer",
  },
];

export default function SideQuestsSection() {
  return (
    <section aria-labelledby="side-quests-heading" className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <motion.div {...HEADER_ANIM} className="mb-4 flex items-end justify-between">
          <h2 id="side-quests-heading" className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">05</span> — Side Quests
          </h2>
          <Link
            to="/games"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#888888] hover:text-[#E8B84B] transition-colors duration-150"
          >
            All games <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[#888888] italic mb-16">
          "Weekend builds that got out of hand."
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {games.map(({ id, title, tag, description, path }, i) => (
            <motion.div
              key={id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                className="relative h-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl"
                initial={{ boxShadow: "0 0 0px rgba(232, 184, 75, 0)" }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(232, 184, 75, 0.45)", zIndex: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={path} className="group flex flex-col p-6 h-full gap-4">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B] self-start">
                    {tag}
                  </span>
                  <h3 className="font-syne font-bold text-2xl text-[#E8B84B] tracking-tight group-hover:text-white transition-colors duration-150">
                    {title}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed flex-1">
                    {description}
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#555555] group-hover:text-[#E8B84B] transition-colors duration-150 pt-3 border-t border-[#2A2A2A]">
                    Play now <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="sm:hidden mt-8 text-center"
        >
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#888888] hover:text-[#E8B84B] transition-colors duration-150"
          >
            All games <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
