import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "build",
    format: ["cjs"],
    dts: true,
    clean: true,
    bundle: true,
    minify: true,
    target: "es2022",
});
