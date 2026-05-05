import { motion } from "framer-motion";
import profileImage from "../assets/images/profile2.jpeg";

const HEADER_ANIM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

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
  return (
    <section className="bg-[#111111] border-t border-[#2A2A2A] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-16">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">01</span> — About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Bio */}
          <motion.div {...BIO_ANIM} className="space-y-5 text-[#888888] text-lg leading-relaxed">
            <p>
              Hey, I'm{" "}
              <span className="text-[#E8B84B] font-semibold">Ankit</span> — a
              full-stack and mobile developer with 4+ years of experience
              building products that people actually use. Currently at{" "}
              <span className="text-white font-medium">BetterWorks</span>,
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

          {/* Right: Profile photo */}
          <motion.div {...PHOTO_ANIM} className="flex justify-center">
            <img
              src={profileImage}
              alt="Ankit Bhardwaj"
              className="h-80 w-80 object-cover rounded-full ring-2 ring-[#E8B84B] ring-offset-4 ring-offset-[#111111]"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
