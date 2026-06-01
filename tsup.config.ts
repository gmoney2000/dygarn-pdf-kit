import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react-pdf": "src/react-pdf/index.ts",
    "pdf-lib": "src/pdf-lib/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  sourcemap: true,
  external: ["react", "@react-pdf/renderer", "pdf-lib"],
  target: "es2022",
});
