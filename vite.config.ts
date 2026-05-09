import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // This tells Vite your site is in a subfolder
  base: '/timebridgepueb/',
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // This tells the build to ignore Node-only server features
      "node:async_hooks": "empty-module",
    },
  },
  
  define: {
    // Some packages look for this variable; we set it to empty for the browser
    "process.env": {},
  },
});
