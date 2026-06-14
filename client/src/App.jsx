import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import SectionDivider from "./components/SectionDivider";
import BlogIndex from "./blog/BlogIndex";
import BlogPost from "./blog/BlogPost";
import GamesIndex from "./games/GamesIndex";
import Game2048 from "./games/Game2048";
import GameWordle from "./games/GameWordle";
import GameTyperacer from "./games/GameTyperacer";
import DrawPage from "./draw/DrawPage";
import PricingPage from "./pricing/PricingPage";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminPosts from "./admin/AdminPosts";
import AdminPostEditor from "./admin/AdminPostEditor";
import AdminComments from "./admin/AdminComments";

function PortfolioHome() {
  return (
    <>
      <GoldenCursor />
      <Header />
      <div id="home">
        <Hero />
      </div>
      {/* <StatsStrip /> */}
      <SectionDivider />
      <div id="experience">
        <Experience />
      </div>
      <SectionDivider />
      <div id="projects">
        <Projects />
      </div>
      <SectionDivider />
      <div id="blog">
        <FieldNotesSection />
      </div>
      <SectionDivider />
      <div id="games">
        <SideQuestsSection />
      </div>
      <SectionDivider />
      <div id="skills">
        <Skills />
      </div>
      <SectionDivider />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <SectionDivider />
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
      <Route path="/pricing" element={<PricingPage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/posts" replace />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="posts/new" element={<AdminPostEditor />} />
        <Route path="posts/:slug/edit" element={<AdminPostEditor />} />
        <Route path="comments" element={<AdminComments />} />
      </Route>
    </Routes>
  );
}
