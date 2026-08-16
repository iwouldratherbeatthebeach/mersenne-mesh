import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist-worker",
    emptyOutDir: true,
    target: "es2022",
    minify: true,
    lib: {
      entry: "worker/index.ts",
      formats: ["es"],
      fileName: () => "_worker.js",
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
