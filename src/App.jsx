// App.jsx
import React, { useState, useRef } from "react"; // useRef might still be useful elsewhere
import Hero from "./components/Hero";
import "./assets/css/index.css";
import Header from "./components/Header"; // No scroll handler needed from Header
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
// import Projects from "./components/Projects";
import { Route, Routes, BrowserRouter } from "react-router-dom"; // Ensure BrowserRouter or equivalent is wrapping App

export default function App() {
  const [isOnePage, setIsOnePage] = useState(true);

  // Refs can be kept if used elsewhere, but not needed for HashLink click-scroll
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);
  // const projectsRef = useRef(null);

  // IDs on the wrappers are ESSENTIAL for HashLink to find the target
  return (
    <>
      {/* Pass only isOnePage state to Header */}
      <Header isOnePage={isOnePage} />

      {isOnePage ? (
        // One-Page Mode: Ensure elements have IDs for HashLink
        <>
          <div ref={heroRef} id="home">
            {" "}
            {/* ID is crucial */}
            <Hero />
          </div>
          <div ref={skillsRef} id="skills">
            {" "}
            {/* ID is crucial */}
            <Skills />
          </div>
          <div ref={experienceRef} id="experience">
            {" "}
            {/* ID is crucial */}
            <Experience />
          </div>
          <div ref={educationRef} id="education">
            {" "}
            {/* ID is crucial */}
            <Education />
          </div>
          {/* <div ref={projectsRef} id="projects"> ID is crucial
             <Projects />
           </div> */}
          <div ref={contactRef} id="contact">
            {" "}
            {/* ID is crucial */}
            <Contact />
          </div>
        </>
      ) : (
        // Router Mode: Remains the same
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      )}
    </>
  );
}
