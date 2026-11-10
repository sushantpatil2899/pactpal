import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./design/global.css";
import "./design/records.css";
import "./app/app.css";
import { App } from "./App";
import { applyTheme, savedTheme } from "./design/theme";
import { applyTokens } from "./design/tokens";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

applyTokens(document);
applyTheme(savedTheme());

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
