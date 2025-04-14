// Header.jsx
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaLaptopCode,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaEnvelope,
  FaBars,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; // Import HashLink

// Accept isOnePage prop
export default function Header({ isOnePage }) {
  const location = useLocation();

  // Function to get the active section based on current mode and location
  const getCurrentActiveLink = () => {
    const path = location.pathname.substring(1);
    const hash = location.hash.substring(1); // Get hash without '#'

    if (isOnePage) {
      return hash || "home"; // Use hash in one-page mode, default to 'home'
    } else {
      // In router mode, match the path. Handle root path explicitly.
      if (location.pathname === "/") return "home";
      return path;
    }
  };

  const [activeLink, setActiveLink] = useState(getCurrentActiveLink);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Effect to update active link when location changes (e.g., scroll, back/forward)
  useEffect(() => {
    setActiveLink(getCurrentActiveLink());
  }, [location, isOnePage]); // Re-run when location or mode changes

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { id: "home", icon: FaHome, text: "Home", path: "/" },
    { id: "skills", icon: FaCode, text: "Skills", path: "/skills" },
    {
      id: "experience",
      icon: FaBriefcase,
      text: "Experience",
      path: "/experience",
    },
    {
      id: "education",
      icon: FaGraduationCap,
      text: "Education",
      path: "/education",
    },
    // { id: "projects", icon: FaLaptopCode, text: "Projects", path: "/projects" },
    { id: "contact", icon: FaEnvelope, text: "Contact", path: "/contact" },
  ];

  // Simplified click handler
  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close mobile menu on click
    // No need to manually set activeLink here, useEffect handles it
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
      <div className="md:fixed md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-auto">
        <div className="p-[2px] md:rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500 animate-gradient-x">
          <nav className="bg-gray-900/90 backdrop-blur-md md:rounded-full px-4 md:px-6 py-2.5">
            {/* Mobile Menu Button */}
            <div className="flex justify-between items-center md:hidden px-2">
              {/* Use HashLink for the portfolio/home link too */}
              <HashLink
                to={isOnePage ? "/#home" : "/"}
                smooth={isOnePage}
                onClick={handleLinkClick}
                className="text-white font-bold"
              >
                Portfolio
              </HashLink>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <FaBars />
              </button>
            </div>

            {/* Navigation Links */}
            <div className={`${isMenuOpen ? "block" : "hidden"} md:block`}>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1 lg:gap-2 py-4 md:py-0">
                {navLinks.map(({ id, icon: Icon, text, path }) => {
                  // Determine the target URL based on the mode
                  const linkTo = isOnePage ? `/#${id}` : path;

                  return (
                    <HashLink // Use HashLink component
                      key={id}
                      to={linkTo}
                      smooth={isOnePage} // Enable smooth scroll only in one-page mode
                      onClick={handleLinkClick} // Just close menu
                      className={`px-3 py-2 md:py-1.5 rounded-lg md:rounded-full text-sm font-medium
                        transition-all duration-300 flex items-center gap-2
                        hover:bg-white/10
                        ${
                          activeLink === id // Use state for highlighting
                            ? "bg-white/15 text-white"
                            : "text-gray-300 hover:text-white"
                        }
                      `}
                      // You can optionally add aria-current if needed
                      aria-current={activeLink === id ? "page" : undefined}
                    >
                      <Icon
                        className={`text-base ${
                          activeLink === id ? "scale-110" : ""
                        }`}
                      />
                      <span className="inline">{text}</span>
                    </HashLink>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x { /* ... animation ... */ }
        .animate-gradient-x { /* ... animation styles ... */ }
      `}</style>
    </header>
  );
}
