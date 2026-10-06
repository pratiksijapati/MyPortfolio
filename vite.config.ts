import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    // three.js lives only in the lazily loaded Hero3D chunk (see components/Hero.tsx),
    // which is large by nature; it never blocks the first paint.
    chunkSizeWarningLimit: 1000,
  },
});
