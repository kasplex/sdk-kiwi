import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from "vite-plugin-static-copy";
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import dts from 'vite-plugin-dts'

export default defineConfig({
    base: './',
    plugins: [
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "src/wasm/*",
                    dest: "src/wasm",
                },
            ],
        }),
        esbuildCommonjs(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '~wasm': resolve(__dirname, './src/wasm'),
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
            formats: ["es", "cjs"],
        },
        terserOptions: {
            format: {
                comments: false,
            }
        },
        rollupOptions: {
            output: {
                format: "cjs",
                inlineDynamicImports: false,
                globals: {
                    liteMove: 'sdk-kiwi'
                },
                manualChunks(id) {
                    if (id.includes('wasm')) {
                        return 'wasm';
                    }
                },
                
            }
        },
    }
})
