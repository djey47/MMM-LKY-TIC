/** Configuration for server-side webpack bundle **/

const { outputPath, commonRules, commonPlugins, resolve } = require('./webpack.config.common.js');

module.exports = {
  target: 'node',
  entry: './src/server/helper.ts',
  output: {
    filename: 'node_helper.js',
    path: outputPath,
    libraryTarget: 'umd',
  },
  // - node-helper and logger are MM2 - provided
  // - @serialport/bindings-cpp is a native module and should not be bundled for electron
  externals: [ 'node_helper', 'logger', '@serialport/bindings-cpp' ], 
  module: {
    rules: [...commonRules],
  },
  plugins: [...commonPlugins],
  resolve,
};
