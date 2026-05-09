import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  // 1. Set the base path for GitHub Pages
  base: '/timebridgepueb/',
  
  plugins: [
    tanstackRouterVite(), // Handles your routing
    react(),              // Handles React
    tailwindcss(),        // Handles your styling
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 2. FORCE Vite to use our mock for the server-only module
      "node:async_hooks": path.resolve(__dirname, "./empty-module.js"),
    },
  },
  
  define: {
    // 3. Mock the process environment for the browser
    "process.env": {},
  },
  
  build: {
    // 4. Ensure the build doesn't crash on mixed module types
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
