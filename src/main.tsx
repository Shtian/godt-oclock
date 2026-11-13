import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bagel-fat-one/latin.css";
import "@fontsource/bagel-fat-one/latin-ext.css";
import "@fontsource-variable/fredoka";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
