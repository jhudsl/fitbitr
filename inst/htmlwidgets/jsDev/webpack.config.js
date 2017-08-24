// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    library: 'tagViz',
    libraryTarget: 'umd',
    filename: 'demo/tagViz.js',
  },
  devtool: 'source-map',
  // plugins: [new BundleAnalyzerPlugin()],
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
  module: {
    rules: [
      {
        exclude: '/node_modules/',
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          // presets: [['es2015', {modules: false}]],
          plugins: ['transform-object-rest-spread'],
        },
      },
    ],
  },
};
