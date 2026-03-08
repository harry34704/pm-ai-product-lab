import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/web"),
      "@mockroom/shared": path.resolve(__dirname, "packages/shared/src/index.ts")
    }
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    globals: true
  }
});
