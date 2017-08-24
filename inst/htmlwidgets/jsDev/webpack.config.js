module.exports = {
  entry: './src/main.js',
  output: {
    library: 'tagViz',
    libraryTarget: 'umd',
    filename: 'demo/tagViz.js',
  },
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        exclude: '/node_modules/',
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
