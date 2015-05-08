/**
 * A module for working with the URL file
 *
 */

'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var co = require('co');
var fs = require('fs');
var instapromise = require('instapromise');
var jsonParseAsync = require('@exponent/json-parse-async');
var path = require('path');
var request = require('request');

var api = require('./api');
var config = require('./config');

var DEFAULT_URL_FILE = '.exponent.url';

var entryPointAsync = _asyncToGenerator(function* () {
  var pkg = yield jsonParseAsync('package.json');
  var entryPoint = pkg.main || 'index.js';
  return entryPoint;
});

var guessMainModulePathAsync = _asyncToGenerator(function* () {
  var entryPoint = yield entryPointAsync();
  return entryPoint.replace(/\.js$/, '');
});

function urlFilePath() {
  return path.resolve('.', path.join(config.relativePath, DEFAULT_URL_FILE));
}

var writeUrlFileAsync = co.wrap(function* (url) {
  return yield fs.promise.writeFile(urlFilePath(), url, 'utf8');
});

var readUrlFileAsync = co.wrap(function* () {
  return yield fs.promise.readFile(urlFilePath(), 'utf8');
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

var constructUrlAsync = _asyncToGenerator(function* (opts) {
  var baseUrl = yield readUrlFileAsync();
  opts = opts || {};
  opts.mainModulePath = opts.mainModulePath || (yield guessMainModulePathAsync());
  return constructUrlFromBaseUrl(baseUrl, opts);
});

var mainBundleUrlAsync = co.wrap(function* (opts) {
  return yield constructUrlAsync(opts);
});

var getTestedMainBundleUrlAsync = co.wrap(function* (opts) {
  var url = yield mainBundleUrlAsync(opts);
  //console.log("Testing url " + url);
  return yield testUrlAsync(url);
});

var testUrlAsync = co.wrap(function* (url) {
  var response = yield request.promise.get(url);
  if (!(response.statusCode == 200)) {
    throw new Error('Problem reading from URL ' + url + '\nstatusCode=' + response.statusCode);
  }
  return url;
});

function expUrlFromHttpUrl(url) {
  return ('' + url).replace(/^http(s?)/, 'exp');
}

function sendUrlAsync(recipient, expUrl) {
  return api.callMethodAsync('send', [recipient, expUrl]);
}

module.exports = {
  expUrlFromHttpUrl: expUrlFromHttpUrl,
  readUrlFileAsync: readUrlFileAsync,
  writeUrlFileAsync: writeUrlFileAsync,
  getTestedMainBundleUrlAsync: getTestedMainBundleUrlAsync,
  mainBundleUrlAsync: mainBundleUrlAsync,
  sendUrlAsync: sendUrlAsync,
  testUrlAsync: testUrlAsync,
  entryPointAsync: entryPointAsync,
  guessMainModulePathAsync: guessMainModulePathAsync };
//# sourceMappingURL=sourcemaps/urlUtil.js.map