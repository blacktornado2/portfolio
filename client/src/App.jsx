import React from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/css/index.css";

import Header from "./components/Header";
import GoldenCursor from "./components/GoldenCursor";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import StatsStrip from "./components/StatsStrip";
import Projects from "./components/Projects";
import FieldNotesSection from "./components/FieldNotesSection";
import SideQuestsSection from "./components/SideQuestsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BlogIndex from "./blog/BlogIndex";
import BlogPost from "./blog/BlogPost";
import GamesIndex from "./games/GamesIndex";
import Game2048 from "./games/Game2048";
import GameWordle from "./games/GameWordle";
import GameTyperacer from "./games/GameTyperacer";
import DrawPage from "./draw/DrawPage";

function PortfolioHome() {
  return (
    <>
      <GoldenCursor />
      <Header />
      <div id="home">
        <Hero />
      </div>
      {/* <StatsStrip /> */}
      <div id="experience">
        <Experience />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="blog">
        <FieldNotesSection />
      </div>
      <div id="games">
        <SideQuestsSection />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/games" element={<GamesIndex />} />
      <Route path="/games/2048" element={<Game2048 />} />
      <Route path="/games/wordle" element={<GameWordle />} />
      <Route path="/games/typeracer" element={<GameTyperacer />} />
      <Route path="/draw" element={<DrawPage />} />
    </Routes>
  );
}
