import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "build",
    format: ["esm"],
    dts: true,
    clean: true,
    bundle: true,
    target: "es2022",
});
