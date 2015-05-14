/**
 * A module for working with the URL file
 *
 */

var _ = require('lodash-node');
var fs = require('fs');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var path = require('path');
var request = require('request');

var api = require('./api');
var config = require('./config');

var entryPointAsync = async function() {
  // TODO: Allow configurations that point to iOS main and Android main, etc.
  // and are checked before looking at 'main'
  return await config.packageJsonFile.getAsync('main', 'index.js');
}

var guessMainModulePathAsync = async function () {
  var entryPoint = await entryPointAsync();
  return entryPoint.replace(/\.js$/, '');
}

function constructUrlFromBaseUrl(baseUrl, opts) {
  var url = baseUrl;
  opts = opts || {};
  var {mainModulePath, dev, minify} = opts;
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

async function constructUrlAsync(opts) {
  if (_.isString(opts)) {
    opts = {type: opts};
  }
  opts = opts || {};
  var key = opts.type;
  var baseUrl = await config.expInfoFile.getAsync(key + 'BaseUrl');
  opts.mainModulePath = opts.mainModulePath || await guessMainModulePathAsync();
  return constructUrlFromBaseUrl(baseUrl, opts);
}

async function mainBundleUrlAsync(opts) {
  return await constructUrlAsync(opts);
}

async function getTestedMainBundleUrlAsync(opts) {
  var url = await mainBundleUrlAsync(opts);
  return await testUrlAsync(url);
}

async function testUrlAsync(url) {
  var response = await request.promise.get(url);
  if (!(response.statusCode == 200)) {
    throw new Error("Problem reading from URL " + url + "\nstatusCode=" + response.statusCode);
  }
  return url;
}

function expUrlFromHttpUrl(url) {
  return ('' + url).replace(/^http(s?)/,'exp');
}

function sendUrlAsync(recipient, expUrl) {
  return api.callMethodAsync('send', [recipient, expUrl]);
}

module.exports = {
  constructUrlFromBaseUrl,
  expUrlFromHttpUrl,
  getTestedMainBundleUrlAsync,
  mainBundleUrlAsync,
  sendUrlAsync,
  testUrlAsync,
  entryPointAsync,
  guessMainModulePathAsync,
};
