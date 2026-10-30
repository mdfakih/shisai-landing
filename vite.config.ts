import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  // One year for the browser bundle and the pre-render, so their HTML matches.
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    // scripts/prerender.mjs reads the manifest to preload each route's chunk.
    manifest: !isSsrBuild,
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
            },
          },
    },
  },
}));
