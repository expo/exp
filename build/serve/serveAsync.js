'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var crayon = require('@ccheever/crayon');
var delayAsync = require('delay-async');
var freeportAsync = require('freeport-async');
var instapromise = require('instapromise');
var network = require('@exponent/network');
var ngrok = require('ngrok');

var config = require('../config');
var PackagerController = require('./PackagerController');
var urlUtil = require('../urlUtil');

function _randomPortRangeStart() {
  return 19000 + Math.floor(Math.random() * 1000);
}

module.exports = _asyncToGenerator(function* (opts) {

  var expSettings = yield config.expInfoFile.readAsync();
  opts = opts || {};
  var port = opts.port || expSettings.port || (yield freeportAsync(_randomPortRangeStart()));

  var pc = new PackagerController({ port: port });
  pc.start();
  var ngrokUrl$ = ngrok.promise.connect({ port: port });

  var _ref = yield _Promise.all([pc.packagerReady, ngrokUrl$, network.privateIpAsync(), urlUtil.entryPointAsync(), urlUtil.guessMainModulePathAsync()]);

  var _ref2 = _slicedToArray(_ref, 5);

  var _ready = _ref2[0];
  var ngrokBaseUrl = _ref2[1];
  var lanIp = _ref2[2];
  var entryPoint = _ref2[3];
  var mainModulePath = _ref2[4];

  var lanBaseUrl = 'http://' + lanIp + ':' + port;
  var localhostBaseUrl = 'http://localhost:' + port;

  var urlOpts = { entryPoint: entryPoint, mainModulePath: mainModulePath };
  var lanUrl = urlUtil.constructUrlFromBaseUrl(lanBaseUrl, urlOpts);
  var localhostUrl = urlUtil.constructUrlFromBaseUrl(localhostBaseUrl, urlOpts);
  var ngrokUrl = urlUtil.constructUrlFromBaseUrl(ngrokBaseUrl, urlOpts);

  var writeInfoFile$ = config.expInfoFile.mergeAsync({
    port: port,
    ngrokBaseUrl: ngrokBaseUrl, lanBaseUrl: lanBaseUrl, localhostBaseUrl: localhostBaseUrl,
    ngrokUrl: ngrokUrl, lanUrl: lanUrl, localhostUrl: localhostUrl });

  var _ref3 = yield _Promise.all([writeInfoFile$, urlUtil.testUrlAsync(localhostUrl)]);

  var _ref32 = _slicedToArray(_ref3, 2);

  var _data = _ref32[0];
  var _true = _ref32[1];

  return _data;
});

if (require.main === module) {
  module.exports().then(crayon.cyan.log, crayon.red.log);
}
//# sourceMappingURL=../sourcemaps/serve/serveAsync.js.map