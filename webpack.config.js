const path = require('path')

module.exports = {
  entry: './worker/index.ts',
  output: {
    filename: 'worker.mjs',
    libraryTarget: 'module',
    path: path.join(__dirname, 'out'),
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // transpileOnly is useful to skip typescript checks occasionally:
          transpileOnly: true,
        },
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
}
