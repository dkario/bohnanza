const autoprefixer = require('autoprefixer');
const paths = require('./config/paths');

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
        test: /\.js$/,
        loader: 'eslint',
        include: paths.src,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
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
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?importLoaders=1',
          'postcss',
        ],
      },
    ],
    postcss: () => [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 11',
        ],
      }),
    ],
  },
};
