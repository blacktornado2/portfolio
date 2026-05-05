import { motion } from "framer-motion";
import { BookOpen, Calendar, Award } from "lucide-react";

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
const CARD_HOVER = { scale: 1.01 };
const VIEWPORT_ONCE = { once: true };

const educationData = [
  {
    degree: "B. Tech (Computer Science)",
    school: "J.C. Bose University of Science and Technology, YMCA",
    mascot: "💻",
    year: "2018 – 2022",
    achievements: ["CGPA: 8.0"],
    subjects: ["C++", "Operating System", "OOPS", "DBMS"],
    description:
      "Focused on core computer science subjects with emphasis on practical laboratory work and scientific research methodologies. Enjoyed college life ^_^",
  },
  {
    degree: "Intermediate (+2)",
    school: "St. Crispin's Sr. Sec. School",
    mascot: "📘",
    year: "2016 – 2017",
    achievements: ["Percentage: 92%"],
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    description:
      "Developed strong analytical and critical thinking skills through comprehensive study of science. Studies were highly engaging :D",
  },
  {
    degree: "Matriculation",
    school: "St. Crispin's Sr. Sec. School, Gurugram",
    mascot: "📕",
    year: "2014 – 2015",
    achievements: ["CGPA: 9.4"],
    subjects: ["Science", "English", "Social Studies", "Economics", "History"],
    description:
      "Developed knowledge in a variety of subjects. Played sports like cricket, badminton, football, volleyball. Life was pretty easy :)",
  },
];

export default function EducationSection() {
  return (
    <section aria-labelledby="education-heading" className="bg-[#111111] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div {...HEADER_ANIM} className="mb-4">
          <h2 id="education-heading" className="font-syne font-bold text-4xl lg:text-5xl text-white">
            <span className="text-[#E8B84B]">04</span> — Education
          </h2>
        </motion.div>

        <motion.p {...SUBHEADER_ANIM} className="text-[#888888] mb-16">
          Discover how academic excellence shapes innovative thinking and
          professional growth.
        </motion.p>

        {/* Cards — 2-col grid, last card centered on md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationData.map(({ degree, school, mascot, year, achievements, subjects, description }, i) => (
            <motion.div
              key={degree}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={cardVariants}
              whileHover={CARD_HOVER}
              className={`bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 ${
                i === educationData.length - 1 && educationData.length % 2 !== 0
                  ? "md:col-span-2 md:max-w-lg md:mx-auto md:w-full"
                  : ""
              }`}
              style={CARD_BORDER}
            >
              {/* Header row */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl" aria-hidden="true">{mascot}</span>
                <div>
                  <h3 className="font-syne font-bold text-white text-xl leading-tight">
                    {degree}
                  </h3>
                  <span className="text-[#888888] text-sm flex items-center gap-1.5 mt-1">
                    <BookOpen className="w-4 h-4 text-[#E8B84B] flex-shrink-0" aria-hidden="true" />
                    {school}
                  </span>
                </div>
              </div>

              {/* Year */}
              <p className="text-[#888888] text-xs flex items-center gap-1.5 mb-4">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {year}
              </p>

              <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
                {/* Description */}
                <p className="text-[#888888] text-sm italic border-l-2 border-[#2A2A2A] pl-3">
                  {description}
                </p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 text-xs text-[#E8B84B] bg-[#E8B84B15] border border-[#E8B84B33] rounded-full px-3 py-1"
                    >
                      <Award className="w-3 h-3" aria-hidden="true" />
                      {a}
                    </span>
                  ))}
                </div>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-[#111111] border border-[#2A2A2A] text-[#666666] px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
