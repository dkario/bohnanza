#!/usr/bin/env node

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

const port = process.env.PORT || 3000;

function createCompiler() {
  return webpack(config);
}

function run() {
  const compiler = createCompiler();
  const devServer = new WebpackDevServer(compiler, {});
  devServer.listen(port);
}

run();
