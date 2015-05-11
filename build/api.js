/*eU

 * Makes an API call to exp.host
 *
 */

'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

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

var getBaseUrlAsync = _asyncToGenerator(function* () {
  // TODO: Let you specify host and port with command line arguments (use config module)

  var _ref = yield userSettings.readFileAsync();

  var api = _ref.api;

  var host = api && api.host || HOST;
  var port = api && api.port || PORT;
  var baseUrl = api && api.baseUrl || 'http://' + host + ':' + port + '/--/api';
  return baseUrl;
});

var callMethodAsync = _asyncToGenerator(function* (methodName, args) {

  var baseUrl = yield getBaseUrlAsync();

  // TODO: Make it so we don't read the userSettings file twice in a row needlessly,
  // ... but not a big deal for now
  var settings = yield userSettings.readFileAsync();
  var username = settings.username;
  var hashedPassword = settings.hashedPassword;

  log('username=', username, 'hashedPassword=', hashedPassword);

  var url = baseUrl + '/' + encodeURIComponent(methodName) + '/' + encodeURIComponent(JSON.stringify(args));
  if (username && hashedPassword) {
    url += '?username=' + encodeURIComponent(username) + '&hashedPassword=' + encodeURIComponent(hashedPassword);
  }
  log('url=', url);

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
  getBaseUrlAsync: getBaseUrlAsync };
//# sourceMappingURL=sourcemaps/api.js.map