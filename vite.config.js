import * as path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "main.js"),
      name: "form-wc",
    },
  },
});
