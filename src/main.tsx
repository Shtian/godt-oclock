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

// Cache the app for offline use once installed to the home screen (production only,
// so the dev server never gets stuck behind a stale cache).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
