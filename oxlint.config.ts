import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "react", "jest", "unicorn", "oxc"],
  ignorePatterns: ["node_modules/**"],
  categories: {
    correctness: "error",
  },
});
