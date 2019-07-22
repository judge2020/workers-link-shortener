const path = require('path');

module.exports = {
    devtool: 'hidden-source-map', // eval() doesn't work in CF's workers
    entry: './src/worker.ts',
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: [/node_modules/],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js' ]
    },
    output: {
        filename: 'worker.js',
        path: path.resolve(__dirname, 'dist')
    }
};
