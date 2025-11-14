import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Important for correct path handling in Vercel
  base: "/",
  build: {
    outDir: "dist",
  },
});
