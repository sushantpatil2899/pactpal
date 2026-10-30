import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the server runs separately; forward its paths so the page and the server
// still share one address, as they do when the server serves the built pages.
const server = "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": server, "/auth": server } },
});
