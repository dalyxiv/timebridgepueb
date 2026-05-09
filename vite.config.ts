import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouterVite } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/timebridgepueb/',
  plugins: [
    tanstackRouterVite(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // This is the critical fix for the AsyncLocalStorage error
      "node:async_hooks": path.resolve(__dirname, "./empty-module.js"),
    },
  },
  define: {
    "process.env": {},
  }
});
