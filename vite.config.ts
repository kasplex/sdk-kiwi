import { defineConfig } from 'vite'
import { resolve } from 'path'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import dts from 'vite-plugin-dts'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { copy } from 'fs-extra';

export default defineConfig({
    base: './',
    plugins: [
        wasm(),
        topLevelAwait(),
        esbuildCommonjs(),
        dts({
            insertTypesEntry: true,
        }),
        {
            name: 'vite-plugin-static-copy',
            buildStart() {
                console.log('Build started');
            },
            writeBundle() {
                console.log('Copying static files...');
                const src = resolve(__dirname, 'src/wasm');
                const dest = resolve(__dirname, 'dist/src/wasm');
                copy(src, dest, (err) => {
                    if (err) {
                        console.error('Error copying files:', err);
                    } else {
                        console.log('Files copied successfully');
                    }
                });
            }
        }
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
            name: 'sdkKiwi',
            fileName: 'sdk-kiwi',
            formats: ["es", "cjs"],
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
