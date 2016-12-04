var path = require('path');
var fs = require('fs');

var appDirectory = process.cwd();
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  indexJs: resolveApp('src/index.js'),
  dist: resolveApp('dist')
};
