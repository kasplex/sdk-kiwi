import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    plugins: [
        wasm(), 
        topLevelAwait()
    ],
    build: {
        target: "esnext",
        lib: {
            entry: "src/index.ts",
            name: "sdk-wiki",
            formats: ["es", "cjs", "umd"],
            fileName: (format) => `sdk-wiki.${format}.js`,
        },
        rollupOptions: {
            external: ["@kasdk/web"],
            output: {
                globals: {
                    "@kasdk/web": "KasdkWeb",
                },
            },
        },
    },
});
