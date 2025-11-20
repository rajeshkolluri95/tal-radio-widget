/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    peerDepsExternal(),
    dts({
      insertTypesEntry: true,
      outDir: "dist",
    }),
  ],
  server: {
    host: "::", // listen on all IPv6 addresses
    port: 3000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RadioWidget",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.cjs.js"),
    },

    rollupOptions: {
      // Exclude peer deps and large libs from bundle
      external: ["react", "react-dom", "firebase", "lucide-react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          firebase: "firebase",
          "react/jsx-runtime": "jsxRuntime",
        },
        assetFileNames: "assets/[name][extname]",
      },
    },

    sourcemap: false,
    emptyOutDir: true,
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
});
