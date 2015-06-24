/**
 * A module for working with the URL file
 *
 */

var _ = require('lodash-node');
var crayon = require('@ccheever/crayon');
var fs = require('fs');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var needle = require('needle');
var path = require('path');
var simpleSpinner = require('@exponent/simple-spinner');

var api = require('./api');
var CommandError = require('./commands/CommandError');
var config = require('./config');
var log = require('./log');
var urlOpts = require('./commands/urlOpts');

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
  var httpUrl = url.replace(/^exp:\/\//, 'http://');
  var response = await needle.promise.get(httpUrl);
  if (!(response.statusCode == 200)) {
    throw new Error("Problem reading from URL " + httpUrl + "\nstatusCode=" + response.statusCode);
  }
  return url;
}

function expUrlFromHttpUrl(url) {
  return ('' + url).replace(/^http(s?)/,'exp');
}

function sendUrlAsync(recipient, expUrl) {
  return api.callMethodAsync('send', [recipient, expUrl]);
}

async function httpRedirectUrlAsync(url) {
  var baseUrl = await api.getExpHostBaseUrlAsync();
  return baseUrl + '/--/to-exp/' + encodeURIComponent(url);
}

async function appetizeWebSimulatorUrlAsync(url) {
  var baseUrl = await api.getExpHostBaseUrlAsync();
  return baseUrl + '/--/appetize?url=' + encodeURIComponent(url);
}

async function testLoadingUrlWithLogging(httpUrl) {

  log("Testing loading the URL...");
  simpleSpinner.start();
  var err = undefined;
  try {
    var ok = await testUrlAsync(httpUrl);
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
  log("OK.");

}

async function urlFromEnvAsync(env) {
  var argv = env.argv;
  var args = argv._;

  var uo = urlOpts.optsFromEnv(env, {type: 'ngrok'});

  try {
    var httpUrl = await mainBundleUrlAsync(uo);
  } catch (e) {
    throw CommandError('NO_URL', env, "There doesn't seem to be a URL for this package. Try running `exp start` first.\n" + e.message);
  }

  var url = httpUrl;
  if (!argv.http) {
    url = expUrlFromHttpUrl(url);
  }

  if (argv.web) {
    url = await appetizeWebSimulatorUrlAsync(url);
  }

  if (argv.redirect) {
    url = await httpRedirectUrlAsync(url);
  }

  if (argv.short) {
    try {
      var result = await api.callMethodAsync('shortenUrl', {url});
    } catch (e) {
      throw Error("Failed to shorten URL: " + e.message);
    }
    crayon.gray.error(result.longUrl);
    url = result.shortUrl;
  }

  return url;

}


module.exports = {
  appetizeWebSimulatorUrlAsync,
  constructUrlFromBaseUrl,
  expUrlFromHttpUrl,
  getTestedMainBundleUrlAsync,
  mainBundleUrlAsync,
  sendUrlAsync,
  testUrlAsync,
  entryPointAsync,
  guessMainModulePathAsync,
  httpRedirectUrlAsync,
  testLoadingUrlWithLogging,
  urlFromEnvAsync,
};
