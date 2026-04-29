import React from "react";
import { motion } from "framer-motion";
import profileImage from "../assets/images/profile2.jpeg";

export default function AboutMe() {
  return (
    <section className="bg-[#111111] border-t border-[#2A2A2A] py-24 px-6 lg:px-12">
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
            <span className="text-[#E8B84B]">01</span> — About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-[#888888] text-lg leading-relaxed">
              Hey, I am{" "}
              <span className="text-[#E8B84B] font-semibold">Ankit :) </span>
              <br />
              I'm a software developer with over 3 years of experience, currently
              working at one.com as a SDE-1.
              <br />
              <br />
              I have experience in Full Stack Development working with React
              Native, React.js, Node.js, PostgreSQL, CockroachDB, MongoDB, Redux
              and Firebase.
              <br />
              <br />
              I am passionate about building scalable and high-performance
              applications, focusing on clean and efficient code. I enjoy solving
              complex problems and continuously learning new technologies to
              enhance my skill set.
              <br />
              <br />
              Apart from coding, I like travelling, playing sports like cricket,
              badminton, swimming etc. and working out at the gym. Always open to
              new connections — feel free to reach out. I appreciate you taking
              the time to learn more about me{" "}
              <span className="text-[#E8B84B]">^_^</span>
            </p>
          </motion.div>

          {/* Right: Profile photo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
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
