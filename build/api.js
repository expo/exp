'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var getExpHostBaseUrlAsync = _asyncToGenerator(function* () {
  var api = yield userSettings().getAsync('api', null);
  var host = api && api.host || HOST;
  var port = api && api.port || PORT;
  var baseUrl = api && api.baseUrl || 'http://' + host + ':' + port;
  return baseUrl;
});

var getApiBaseUrlAsync = _asyncToGenerator(function* () {
  // TODO: Let you specify host and port with command line arguments (use config module)
  var expHostBaseUrl = yield getExpHostBaseUrlAsync();
  var baseUrl = expHostBaseUrl + '/--/api';
  return baseUrl;
});

/*eU

 * Makes an API call to exp.host
 *
 */

var instapromise = require('instapromise');
var request = require('request');

var log = require('./log');
var userSettings = require('./userSettings');

var HOST = 'exp.host';
var PORT = 80;

function ApiError(code, env, message) {
  var err = new Error(message);
  err.code = code;
  err.env = env;
  err._isApiError = true;
  return err;
}

;

var callMethodAsync = _asyncToGenerator(function* (methodName, args) {

  var baseUrl = yield getApiBaseUrlAsync();

  // TODO: Make it so we don't read the userSettings file twice in a row needlessly,
  // ... but not a big deal for now
  var settings = yield userSettings().readAsync();
  var username = settings.username;
  var hashedPassword = settings.hashedPassword;

  //log("username=", username, "hashedPassword=", hashedPassword);

  var url = baseUrl + '/' + encodeURIComponent(methodName) + '/' + encodeURIComponent(JSON.stringify(args));
  if (username && hashedPassword) {
    url += '?username=' + encodeURIComponent(username) + '&hashedPassword=' + encodeURIComponent(hashedPassword);
  }
  //log("url=", url);

  var response = yield request.promise.post(url);
  var body = response.body;
  try {
    var response = JSON.parse(body);
  } catch (e) {
    var err = new Error('Unparseable response from API server: ' + body);
    throw err;
  }
  if (response.err) {
    throw ApiError(response.code, response.err.env, response.err);
  }
  return response;
});

module.exports = {
  callMethodAsync: callMethodAsync,
  getExpHostBaseUrlAsync: getExpHostBaseUrlAsync,
  getApiBaseUrlAsync: getApiBaseUrlAsync };
//# sourceMappingURL=sourcemaps/api.js.map