import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // FIXED: Changed to root path
  base: "/", 
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "node:async_hooks": path.resolve(__dirname, "./empty-module.js"),
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets', 
  }
});
