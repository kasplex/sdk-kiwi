import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from "vite-plugin-static-copy";
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import dts from 'vite-plugin-dts'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';


export default defineConfig({
    base: './',
    plugins: [
        wasm(),
        topLevelAwait(), // 允许 `import()` 直接解构 wasm
        esbuildCommonjs(),
        viteStaticCopy({
            targets: [{ src: "src/wasm", dest: "src/wasm" }], // 复制到根目录,
        }),
        dts()
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
