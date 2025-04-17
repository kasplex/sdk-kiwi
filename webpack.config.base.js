const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.wasm$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.wasm'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            "wasm/kaspa": path.resolve(__dirname, "wasm/kaspa-node"),
        },
    },
    experiments: {
        asyncWebAssembly: true,
    },
    optimization: {
        moduleIds: 'deterministic',
    },
}; 