import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    // Retained source suites launch bounded child workers; avoid nested outer oversubscription.
    maxWorkers: 1,
    setupFiles: ["./tests/construction-ci-recovery-20261116/yield-task-updates.mjs"],
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      reporter: ["text", "json", "html"]
    }
  }
});
