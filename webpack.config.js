var paths = require('./config/paths');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    paths.indexJs
  ],
  output: {
    path: paths.dist,
    filename: 'bundle.js'
  }
};
