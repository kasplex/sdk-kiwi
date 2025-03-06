import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { copy } from 'fs-extra';

export default defineConfig({
    base: './',
    plugins: [
        wasm(),
        topLevelAwait(),
        esbuildCommonjs(),
        dts(),
        {
            name: 'vite-plugin-static-copy',
            buildStart() {
                console.log('Build started');
            },
            writeBundle() {
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
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                kiwi: resolve(__dirname, 'src/kiwi.ts'),
            },
            name: 'sdkKiwi',
            formats: ["es", "cjs"],
            fileName: (format, entryName) => {
                if (format === 'es') return `${entryName}.js`;
                if (format === 'cjs') return `${entryName}.cjs`;
                return `${entryName}.${format}.js`;
            }
        },
        terserOptions: {
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            external: [
                'src/wasm/**/*',
                'examples/**/*',
                'tests/**/*'
            ],
            output: {
                dir: resolve(__dirname, 'dist'),
                format: "cjs",
                inlineDynamicImports: false,
                globals: {
                    liteMove: 'sdk-kiwi'
                },
                manualChunks(id) {
                    if (id.includes('wasm') || id.includes('examples/') || id.includes('tests/')) {
                        return 'wasm';
                    }
                },
                
            }
        },
    }
})
