import React from "react";
import profileImage from "../assets/images/profile2.jpeg";

const AboutMe = () => {
  return (
    <section
      className="about-section bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 text-white py-32 pb-40 flex items-center justify-center"
    >
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 justify-center font-mono">
        <div className="content max-w-2xl">
          <h2 className="text-[#4ECCA3] text-3xl font-bold mb-12">WHO AM I?</h2>
          <p className="text-lg leading-loose">
            Hey, I am <span className="text-orange-400 font-bold tracking-wide">Ankit :) </span> <br/>
            I'm a software developer with over 3 years of experience, currently working at one.com as a SDE-1.<br/>
            I have experience working in Full Stack Development. I have worked with technologies, frameworks and libraries like React Native, React.js, Node.js, PostgreSQL, CockroachDB, MongoDB, Redux and Firebase.<br/>
            I am passionate about building scalable and high-performance applications, focusing on clean and efficient code. I enjoy solving complex problems and continuously learning new technologies to enhance my skill set.<br/>
            Apart from coding, I like travelling, playing sports like cricket, badminton, swimming etc. and working out at gym.
            I'm always open to new connections and conversations. Feel free to reach out.
            I appreciate you taking the time to learn more about me ^_^
          </p>
        </div>
        <div className="flex items-center overflow-hidden">
          <img
            src={profileImage}
            alt="Profile"
            className="h-80 w-80 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
