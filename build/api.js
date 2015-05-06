/**
 * Makes an API call to exp.host
 *
 */

'use strict';

var co = require('co');
var instapromise = require('instapromise');
var request = require('request');

var userSettings = require('./userSettings');

var HOST = 'exp.host';
var PORT = 80;

var getBaseUrlAsync = co.wrap(function* () {
  // TODO: Let you specify host and port with command line arguments (use config module)

  var _ref = yield userSettings.readFileAsync();

  var api = _ref.api;

  var host = api && api.host || HOST;
  var port = api && api.port || PORT;
  var baseUrl = api.baseUrl || 'http://' + host + ':' + port + '/__api__';
  return baseUrl;
});

var callMethodAsync = co.wrap(function* (methodName, args) {
  // TODO: Make this configurable at some point
  var baseUrl = yield getBaseUrlAsync();
  var url = baseUrl + '/' + encodeURIComponent(methodName) + '/' + encodeURIComponent(JSON.stringify(args));
  //console.log("url=", url);
  var response = yield request.promise.post(url);
  var body = response.body;
  try {
    return JSON.parse(body);
  } catch (e) {
    var err = new Error('Unparseable response from API server: ' + body);
    throw err;
  }
});

module.exports = {
  callMethodAsync: callMethodAsync,
  getBaseUrlAsync: getBaseUrlAsync };
//# sourceMappingURL=sourcemaps/api.js.map