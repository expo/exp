'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _serve = _asyncToGenerator(function* (opts) {

  var expSettings = yield config.expInfoFile.readAsync();
  opts = opts || {};
  var port = opts.port || expSettings.port || (yield freeportAsync(6080));

  var pc = new PackagerController({ port: port });
  var pcStart$ = pc.startAsync();
  var ngrokUrl$ = ngrok.promise.connect({ port: port });

  try {
    var _ref = yield _Promise.all([pc.packagerReady, ngrokUrl$, network.privateIpAsync(), urlUtil.entryPointAsync(), urlUtil.guessMainModulePathAsync()]);

    var _ref2 = _slicedToArray(_ref, 5);

    var _ready = _ref2[0];
    var ngrokBaseUrl = _ref2[1];
    var lanIp = _ref2[2];
    var entryPoint = _ref2[3];
    var mainModulePath = _ref2[4];
  } catch (e) {

    // Shutdown packager
    var packagerShutdown$ = new _Promise(function (fulfill, reject) {
      log('Attempting to shut down packager (' + pc._packager.pid + ')...');
      pc._packager.on('exit', function (code) {
        log('packager shut down.');
        fulfill(code);
        //console.log("process._getActiveRequests()", process._getActiveRequests().length);
        //console.log("process._getActiveHandles()", process._getActiveHandles().length);
      });
      pc.stopAsync()['catch'](reject);
    });

    // Shutdown ngrok
    var ngrokShutdown$ = new _Promise(function (fulfill, reject) {
      ngrokUrl$.then(function (ngrokBaseUrl) {
        log('Shutting down ngrok...');
        return ngrok.promise.disconnect(ngrokBaseUrl).then(function (x) {
          log('ngrok shutdown.');
          fulfill(x);
        }, function (err) {
          log.error('Disconnecting from ngrok failed', err);
        });
      })['catch'](function (err) {
        log.error('Failed to shutdown ngrok', err.message);
        reject(err);
      });
    });

    // TODO: This is really hacky but does let the process terminate
    _Promise.all([packagerShutdown$, ngrokShutdown$]).then(function () {
      for (var h of process._getActiveHandles()) {
        if (h.destroy) {
          h.destroy();
        }
      }
    })['catch'](function (err) {
      log.error('Error while shutting down.');
    });

    throw e;
  }

  var lanBaseUrl = 'http://' + lanIp + ':' + port;
  var localhostBaseUrl = 'http://localhost:' + port;

  var urlOpts = { entryPoint: entryPoint, mainModulePath: mainModulePath };
  var lanUrl = urlUtil.constructUrlFromBaseUrl(lanBaseUrl, urlOpts);
  var localhostUrl = urlUtil.constructUrlFromBaseUrl(localhostBaseUrl, urlOpts);
  var ngrokUrl = urlUtil.constructUrlFromBaseUrl(ngrokBaseUrl, urlOpts);

  var writeInfoFile$ = config.expInfoFile.mergeAsync({
    port: port,
    ngrokBaseUrl: ngrokBaseUrl, lanBaseUrl: lanBaseUrl, localhostBaseUrl: localhostBaseUrl,
    ngrokUrl: ngrokUrl, lanUrl: lanUrl, localhostUrl: localhostUrl,
    err: null,
    state: 'RUNNING' });

  var _ref3 = yield _Promise.all([writeInfoFile$, urlUtil.testUrlAsync(localhostUrl)]);

  var _ref32 = _slicedToArray(_ref3, 3);

  var _data = _ref32[0];
  var _true = _ref32[1];
  var _pc = _ref32[2];

  return _.assign(_data, { packageController: pc });
});

var crayon = require('@ccheever/crayon');
var freeportAsync = require('freeport-async');
var instapromise = require('instapromise');
var network = require('@exponent/network');
var ngrok = require('ngrok');

var config = require('../config');
var log = require('../log');
var PackagerController = require('./PackagerController');
var urlUtil = require('../urlUtil');

module.exports = function (opts) {
  return _serve(opts)['catch'](function (err) {
    config.expInfoFile.update('err', err.stack());
  });
};

if (require.main === module) {
  module.exports().then(crayon.cyan.log, function (err) {
    crayon.red.log(err);
    // Killing the child_process doesn't seem to work very well,
    // so this is the robust way to do it
  });
}
//# sourceMappingURL=../sourcemaps/serve/serveAsync.js.map