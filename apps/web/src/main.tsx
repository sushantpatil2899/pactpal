import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/martian-mono";
import "./design/global.css";
import { App } from "./App";
import { applyTokens } from "./design/tokens";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

applyTokens(document);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
