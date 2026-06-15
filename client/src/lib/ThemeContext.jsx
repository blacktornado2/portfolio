import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = {
  gold: {
    name: "gold",
    label: "Gold",
    accent: "#E8B84B",
    r0: "rgba(232,184,75,0)",
    r35: "rgba(232,184,75,0.35)",
    r45: "rgba(232,184,75,0.45)",
    r50: "rgba(232,184,75,0.5)",
  },
  blue: {
    name: "blue",
    label: "Blue",
    accent: "#60A5FA",
    r0: "rgba(96,165,250,0)",
    r35: "rgba(96,165,250,0.35)",
    r45: "rgba(96,165,250,0.45)",
    r50: "rgba(96,165,250,0.5)",
  },
  purple: {
    name: "purple",
    label: "Purple",
    accent: "#A78BFA",
    r0: "rgba(167,139,250,0)",
    r35: "rgba(167,139,250,0.35)",
    r45: "rgba(167,139,250,0.45)",
    r50: "rgba(167,139,250,0.5)",
  },
  crimson: {
    name: "crimson",
    label: "Crimson",
    accent: "#F43F5E",
    r0: "rgba(244,63,94,0)",
    r35: "rgba(244,63,94,0.35)",
    r45: "rgba(244,63,94,0.45)",
    r50: "rgba(244,63,94,0.5)",
  },
  green: {
    name: "green",
    label: "Green",
    accent: "#4ADE80",
    r0: "rgba(74,222,128,0)",
    r35: "rgba(74,222,128,0.35)",
    r45: "rgba(74,222,128,0.45)",
    r50: "rgba(74,222,128,0.5)",
  },
  orange: {
    name: "orange",
    label: "Orange",
    accent: "#FB923C",
    r0: "rgba(251,146,60,0)",
    r35: "rgba(251,146,60,0.35)",
    r45: "rgba(251,146,60,0.45)",
    r50: "rgba(251,146,60,0.5)",
  },
};

const ThemeContext = createContext({
  theme: THEMES.crimson,
  setTheme: () => {},
  mode: "dark",
  setMode: () => {},
});

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem("portfolio-theme") || "crimson"
  );
  const [mode, setModeState] = useState(
    () => localStorage.getItem("portfolio-mode") || "dark"
  );

  const theme = THEMES[themeName] ?? THEMES.gold;

  useEffect(() => {
    document.documentElement.dataset.theme = theme.name;
    localStorage.setItem("portfolio-theme", theme.name);
  }, [theme.name]);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem("portfolio-mode", mode);
  }, [mode]);

  function setMode(m) {
    setModeState(m === "light" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
