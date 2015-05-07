/**
 * A module for working with the URL file
 *
 */

'use strict';

var co = require('co');
var fs = require('fs');
var instapromise = require('instapromise');
var path = require('path');
var request = require('request');

var config = require('./config');

var DEFAULT_URL_FILE = '.exponent.url';

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

  mainModulePath = mainModulePath || 'main';
  url += '/' + encodeURIComponent(mainModulePath) + '.';
  if (opts.includeRequire !== false) {
    url += encodeURIComponent('includeRequire.');
  }
  if (opts.runModule !== false) {
    url += encodeURIComponent('runModule.');
  }
  url += 'bundle';
  url += '?dev=' + encodeURIComponent(!!dev);
  return url;
}

var constructUrlAsync = co.wrap(function* (opts) {
  var baseUrl = yield readUrlFileAsync();
  return constructUrlFromBaseUrl(baseUrl, opts);
});

var mainBundleUrlAsync = co.wrap(function* (opts) {
  return yield constructUrlAsync();
});

var getTestedMainBundleUrlAsync = co.wrap(function* () {
  var url = yield mainBundleUrlAsync();
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

module.exports = {
  expUrlFromHttpUrl: expUrlFromHttpUrl,
  readUrlFileAsync: readUrlFileAsync,
  writeUrlFileAsync: writeUrlFileAsync,
  getTestedMainBundleUrlAsync: getTestedMainBundleUrlAsync,
  mainBundleUrlAsync: mainBundleUrlAsync,
  testUrlAsync: testUrlAsync };
//# sourceMappingURL=sourcemaps/urlUtil.js.map