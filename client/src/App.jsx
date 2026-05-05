import React from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/css/index.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
import BlogIndex from "./blog/BlogIndex";
import BlogPost from "./blog/BlogPost";
import GamesIndex from "./games/GamesIndex";
import Game2048 from "./games/Game2048";
import GameWordle from "./games/GameWordle";
import GameTyperacer from "./games/GameTyperacer";

function PortfolioHome() {
  return (
    <>
      <Header />
      <div id="home">
        <Hero />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="education">
        <Education />
      </div>
      <div id="contact">
        <Contact />
      </div>
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
    </Routes>
  );
}
