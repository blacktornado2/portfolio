import { motion } from "framer-motion";
import profileImage from "../assets/images/Ankit-3D.png";
import { HEADER_ANIM } from "../lib/animations";
import { useTheme } from "../lib/ThemeContext";

const BIO_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.1 },
};

const PHOTO_ANIM = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.2 },
};

export default function PortfolioPage() {
  const { theme } = useTheme();
  return (
    <section className="bg-[var(--bg)] border-t border-[var(--border)] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-16">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[var(--text-1)]">
            <span className="text-[var(--accent)]">01</span> — About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Profile photo */}
          <motion.div {...PHOTO_ANIM} className="flex justify-center">
            <motion.img
              src={profileImage}
              alt="Ankit Bhardwaj"
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${theme.r35}, 0 0 80px ${theme.r35}` }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[590px] object-cover rounded-2xl outline outline-2 outline-offset-4 outline-[color:var(--accent)]"
            />
          </motion.div>

          {/* Right: Bio */}
          <motion.div {...BIO_ANIM} className="space-y-5 text-[var(--text-2)] text-lg leading-relaxed">
            <p>
              Hey, I'm{" "}
              <span className="text-[var(--accent)] font-semibold">Ankit</span> — a
              full-stack and mobile developer with 4+ years of experience
              building products that people actually use. Currently at{" "}
              <span className="text-[var(--text-1)] font-medium">BetterWorks</span>,
              working on enterprise performance management software.
            </p>
            <p>
              I care a lot about the quality of what I ship — clean
              architecture, readable code, and interfaces that feel fast and
              intentional. Whether it's designing a solid API, picking the right
              data model, or making a mobile screen feel effortless, I want the
              engineering to be something I'm proud of.
            </p>
            <p>
              Outside work, I travel whenever I can, play cricket and badminton,
              and spend time at the gym. I think the best engineers are curious
              people who live beyond the screen.
            </p>
            <p>
              If you're building something interesting or just want to connect —
              I'm always up for a conversation.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
