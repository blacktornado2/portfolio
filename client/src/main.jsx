import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./lib/ThemeContext.jsx";

// Keep admin-panel visits out of the traffic numbers.
const dropAdminEvents = (event) => (new URL(event.url).pathname.startsWith("/admin") ? null : event);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <App />
        <Analytics beforeSend={dropAdminEvents} />
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
);
