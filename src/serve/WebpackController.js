var freeportAsync = require('freeport-async');
var ReactNativeWebpackServer = require('react-native-webpack-server');
var webpack = require('webpack');

var urlUtil = require('../urlUtil');


async function getConfigAsync(opts) {

  opts = opts || {};

  opts.mainModulePath = opts.mainModulePath || await urlUtil.guessMainModulePathAsync();
  opts.entryPoint = opts.entryPoint || await urlUtil.entryPointAsync();
  var entry = {};
  entry[opts.mainModulePath] = opts.entryPoint;
  opts.entry = opts.entry || entry;

  var config = {

    debug: true,

    devtool: 'source-map',

    entry: entry,

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
    },

    module: {
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loaders: ['babel?stage=0&blacklist=validation.react']},
      ],
    },

    plugins: [],

  };

  // Hot loader
  if (opts.hot) {
    config.devtool = 'eval'; // Speed up incremental builds
    config.entry['index.ios'].unshift('../../hot/entry');
    config.entry['index.ios'].unshift('webpack/hot/only-dev-server');
    config.entry['index.ios'].unshift('webpack-dev-server/client?http://localhost:8082');
    config.output.publicPath = 'http://localhost:8082/';
    config.module.loaders[0].loaders.unshift('react-hot');
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  }

  // Production config
  if (opts.production) {
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  return config;

}

async function createServerAsync(opts) {

  opts = opts || {};
  opts.port = opts.port || 9000;

  /**
   * Create a new server with the following options:
   * {String} hostname (default localhost)
   * {Number} port (default 8080)
   * {Number} packagerPort (default 8081)
   * {Number} webpackPort (default 8082)
   * {String} entry (default index.ios)
   * {Object} webpackConfig (default require(./webpack.config.js))
   * {Boolean} hot enable react-hot-loader (default false)
   *
   * @constructor
   * @param {Object} options
   */

  var [port, packagerPort, webpackPort] = await freeportAsync.rangeAsync(3, opts.port);
  port = opts.port || port;
  packagerPort = opts.packagerPort || packagerPort;
  webpackPort = opts.webpackPort || webpackPort;

  var webpackConfig = await getConfigAsync(opts);

  return new ReactNativeWebpackServer({
    webpackConfig,
    port,
    packagerPort,
    webpackPort,
  });

}

module.exports = {
  createServerAsync,
  getConfigAsync,
};
