var paths = require('./config/paths');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    paths.indexJs,
  ],
  output: {
    path: paths.dist,
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js/,
        loader: 'eslint',
        include: paths.src,
      },
    ],
  },
};
