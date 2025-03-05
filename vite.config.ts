import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from "vite-plugin-static-copy";
import dts from 'vite-plugin-dts'

export default defineConfig({
    base: './',
    plugins: [
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "src/wasm/*",
                    dest: "wasm",
                },
            ],
            overwrite: true, 
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: './dist',
        emptyOutDir: true,
        minify: "terser",
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'sdk-kiwi',
            fileName: 'index',
        },
        terserOptions: {
            format: {
                comments: false,
            },
            compress: (file: string | string[]) => {
                if (file.includes("wasm")) {
                    return false;
                }
                return true;
            },
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("src/wasm/")) {
                        return "wasm";
                    }
                },
                inlineDynamicImports: false,
                globals: {
                    liteMove: 'sdk-kiwi'
                },

            }
        },
    }
})