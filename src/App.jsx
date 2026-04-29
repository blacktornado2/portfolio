// App.jsx
import React, { useRef } from "react";
import Hero from "./components/Hero";
import "./assets/css/index.css";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";

export default function App() {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      <Header />
      <div ref={heroRef} id="home">
        <Hero />
      </div>
      <div ref={skillsRef} id="skills">
        <Skills />
      </div>
      <div ref={experienceRef} id="experience">
        <Experience />
      </div>
      <div ref={educationRef} id="education">
        <Education />
      </div>
      <div ref={contactRef} id="contact">
        <Contact />
      </div>
    </>
  );
}
