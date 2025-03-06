import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import commonjs from 'rollup-plugin-commonjs';
import { copy } from 'fs-extra';

export default defineConfig({
    base: './',
    plugins: [
        wasm(),
        topLevelAwait(),
        dts(),
        commonjs({
            include: ['src/wasm/kaspa/*'],
        }),
        {
            name: 'vite-plugin-static-copy',
            buildStart() {
                console.log('Build started');
            },
            writeBundle() {
                const src = resolve(__dirname, 'src/wasm');
                const dest = resolve(__dirname, 'wasm');
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
            compress: {
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: process.env.NODE_ENV === 'production', 
            }
        },
        rollupOptions: {
            external: [
                'src/wasm/**/*',
                'examples/**/*',
                'tests/**/*'
            ],
            input: {
                index: resolve(__dirname, 'src/index.ts'),
                kiwi: resolve(__dirname, 'src/kiwi.ts'),
            },
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
