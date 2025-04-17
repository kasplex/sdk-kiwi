const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    target: 'node',
    entry: {
        index: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        assetModuleFilename: '[name][ext]', 
        library: '@kasplex/kiwi',
        libraryTarget: 'umd',
        clean: true,
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.js', '.wasm'],
        alias: {
            "@/*": path.resolve(__dirname, 'src/*'),
        },
        fallback: {
            "url": require.resolve("url/"),
            "path": require.resolve("path-browserify"),
        }
    },
    experiments: {
        asyncWebAssembly: true,
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /web\.ts$/, 
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'wasm/kaspa-node/kaspa_bg.wasm',
                    to: 'kaspa_bg.wasm'
                }
            ]
        })
    ]
}); 