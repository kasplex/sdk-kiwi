import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { copy } from 'vite-plugin-copy';
import alias from 'rollup-plugin-alias';

export default defineConfig({
    base: './',
    plugins: [
        wasm(),
        topLevelAwait(),
        dts(),
        commonjs({
            include: ['src/wasm/kaspa/*'],
        }),
        copy({
            targets: [
                { src: 'src/wasm', dest: 'wasm' }
            ]
        }),
        alias({
            entries: [
                { find: '@', replacement: resolve(__dirname, './') },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: "terser",
        target: "esnext",
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                kiwi: resolve(__dirname, 'src/kiwi.ts'),
            },
            name: 'sdkKiwi',
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
            plugins: [
                typescript({
                    target: 'es2020',
                    rootDir: resolve(__dirname, 'src'),
                    declaration: true,
                    declarationDir: resolve(__dirname, 'dist'),
                    exclude: [resolve(__dirname, 'node_modules/**'), resolve(__dirname, 'test/**')],
                    allowSyntheticDefaultImports: true
                })
            ]
        },
    }
})
