import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"; // Capitalized
import { fileURLToPath } from "url";
import path from "path";

// This is required for ESM projects to find your files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Sets the base path for GitHub Pages
  base: '/timebridgepueb/',
  
  plugins: [
    TanStackRouterVite(), // Capitalized
    react(),
    tailwindcss(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Forces the build to ignore Node.js server features
      "node:async_hooks": path.resolve(__dirname, "./empty-module.js"),
    },
  },
  
  define: {
    // Fakes the environment variable for the browser
    "process.env": {},
  }
});
