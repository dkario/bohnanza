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
    loaders: [
      {
        test: /\.js/,
        include: paths.src,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-2',
          ],
          cacheDirectory: true,
        },
      },
    ],
  },
};
