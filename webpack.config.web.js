const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        assetModuleFilename: '[name].[ext]', 
        library: '@kasplex/kiwi-web',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.js', '.wasm'],
        alias: {
            "@": path.resolve(__dirname, 'src'),
            "wasm/kaspa": path.resolve(__dirname, "wasm/kaspa-web"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.wasm$/,
                type: 'asset/resource',
                generator: {
                    filename: 'wasm/[name][ext]',
                    publicPath: './' 
                }
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'wasm/kaspa-web/kaspa.d.ts', to: 'wasm/kaspa.d.ts', }
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};