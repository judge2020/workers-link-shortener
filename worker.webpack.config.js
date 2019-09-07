const path = require('path');

module.exports = {
  devtool: 'hidden-source-map', // eval() doesn't work in CF's workers
  entry: './worker/worker.ts',
  mode: process.env.NODE_ENV || 'development',
  optimization: {
      minimize: false,
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        exclude: [/node_modules/, /src/, /outfrontend/],
        options: {
          configFile: 'worker/tsconfig.json',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
