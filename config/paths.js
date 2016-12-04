const path = require('path');

const appDirectory = process.cwd();
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  indexJs: resolveApp('src/index.js'),
  src: resolveApp('src'),
  dist: resolveApp('dist'),
};
