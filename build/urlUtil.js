/**
 * A module for working with the URL file
 *
 */

'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var constructUrlAsync = _asyncToGenerator(function* (opts) {
  if (_.isString(opts)) {
    opts = { type: opts };
  }
  opts = opts || {};
  var key = opts.type;
  var baseUrl = yield config.expInfoFile.getAsync(key + 'BaseUrl');
  opts.mainModulePath = opts.mainModulePath || (yield guessMainModulePathAsync());
  return constructUrlFromBaseUrl(baseUrl, opts);
});

var mainBundleUrlAsync = _asyncToGenerator(function* (opts) {
  return yield constructUrlAsync(opts);
});

var getTestedMainBundleUrlAsync = _asyncToGenerator(function* (opts) {
  var url = yield mainBundleUrlAsync(opts);
  return yield testUrlAsync(url);
});

var testUrlAsync = _asyncToGenerator(function* (url) {
  var response = yield request.promise.get(url);
  if (!(response.statusCode == 200)) {
    throw new Error('Problem reading from URL ' + url + '\nstatusCode=' + response.statusCode);
  }
  return url;
});

var httpRedirectUrlAsync = _asyncToGenerator(function* (url) {
  var baseUrl = yield api.getExpHostBaseUrlAsync();
  return baseUrl + '/--/to-exp/' + encodeURIComponent(url);
});

var testLoadingUrlWithLogging = _asyncToGenerator(function* (httpUrl) {

  log('Testing loading the URL...');
  simpleSpinner.start();
  var err = undefined;
  try {
    var ok = yield testUrlAsync(httpUrl);
  } catch (e) {
    log(e);
    err = e;
    throw err;
  } finally {
    simpleSpinner.stop();
    console.log(5);
    if (err) {
      log(err);
      throw err;
    }
  }
  log('OK.');
});

var _ = require('lodash-node');
var fs = require('fs');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var path = require('path');
var request = require('request');
var simpleSpinner = require('@exponent/simple-spinner');

var api = require('./api');
var config = require('./config');
var log = require('./log');

var entryPointAsync = _asyncToGenerator(function* () {
  // TODO: Allow configurations that point to iOS main and Android main, etc.
  // and are checked before looking at 'main'
  return yield config.packageJsonFile.getAsync('main', 'index.js');
});

var guessMainModulePathAsync = _asyncToGenerator(function* () {
  var entryPoint = yield entryPointAsync();
  return entryPoint.replace(/\.js$/, '');
});

function constructUrlFromBaseUrl(baseUrl, opts) {
  var url = baseUrl;
  opts = opts || {};
  var mainModulePath = opts.mainModulePath;
  var dev = opts.dev;
  var minify = opts.minify;

  mainModulePath = mainModulePath || 'index.js';
  url += '/' + encodeURIComponent(mainModulePath) + '.';
  if (opts.includeRequire !== false) {
    url += encodeURIComponent('includeRequire.');
  }
  if (opts.runModule !== false) {
    url += encodeURIComponent('runModule.');
  }
  url += 'bundle';
  url += '?dev=' + encodeURIComponent(!!dev);
  if (minify != null) {
    url += '&minify=' + encodeURIComponent(!!minify);
  }
  return url;
}

function expUrlFromHttpUrl(url) {
  return ('' + url).replace(/^http(s?)/, 'exp');
}

function sendUrlAsync(recipient, expUrl) {
  return api.callMethodAsync('send', [recipient, expUrl]);
}

module.exports = {
  constructUrlFromBaseUrl: constructUrlFromBaseUrl,
  expUrlFromHttpUrl: expUrlFromHttpUrl,
  getTestedMainBundleUrlAsync: getTestedMainBundleUrlAsync,
  mainBundleUrlAsync: mainBundleUrlAsync,
  sendUrlAsync: sendUrlAsync,
  testUrlAsync: testUrlAsync,
  entryPointAsync: entryPointAsync,
  guessMainModulePathAsync: guessMainModulePathAsync,
  httpRedirectUrlAsync: httpRedirectUrlAsync,
  testLoadingUrlWithLogging: testLoadingUrlWithLogging };
//# sourceMappingURL=sourcemaps/urlUtil.js.map