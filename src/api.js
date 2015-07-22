/**
 *
 * Makes an API call to exp.host
 *
 */

var instapromise = require('instapromise');
var needle = require('needle');

var log = require('./log');
var userSettings = require('./userSettings');
var session = require('./session');

var HOST = 'exp.host';
var PORT = 80;

function ApiError(code, env, message) {
  var err = new Error(message);
  err.code = code;
  err.env = env;
  err._isApiError = true;
  return err;
}

async function getExpHostBaseUrlAsync() {
  var api = await userSettings.getAsync('api', null);
  var host = (api && api.host) || HOST;
  var port = (api && api.port) || PORT;
  var baseUrl = (api && api.baseUrl) || ('http://' + host + ':' + port);
  return baseUrl;
}

async function getApiBaseUrlAsync() {
  // TODO: Let you specify host and port with command line arguments (use config module)
  var expHostBaseUrl = await getExpHostBaseUrlAsync();
  var baseUrl = expHostBaseUrl + '/--/api';
  return baseUrl;
};

var callMethodAsync = async function (methodName, args) {

  var baseUrl = await getApiBaseUrlAsync();

  // TODO: Make it so we don't read the userSettings file twice in a row needlessly,
  // ... but not a big deal for now
  var settings = await userSettings.readAsync();
  var {username, hashedPassword} = settings;
  //log("username=", username, "hashedPassword=", hashedPassword);

  var url = baseUrl + '/' + encodeURIComponent(methodName) + '/' + encodeURIComponent(JSON.stringify(args));

  // Deprecated
  // if (username && hashedPassword) {
  //   url += '?username=' + encodeURIComponent(username) + '&hashedPassword=' + encodeURIComponent(hashedPassword);
  // }

  //log("url=", url);
  var headers = {
    'Exp-ClientId': await session.clientIdAsync(),
  };
  if (username) {
    headers['Exp-Username'] = username;
  }

  var response = await needle.promise.post(url, null, {headers});
  var ro = response.body;
  // try {
  //   var response = JSON.parse(body);
  // } catch (e) {
  //   var err = new Error("Unparseable response from API server: " + body);
  //   throw err;
  // }
  if (ro.err) {
    throw ApiError(ro.code, ro.err.env, ro.err);
  }
  return ro;
};

module.exports = {
  callMethodAsync,
  getExpHostBaseUrlAsync,
  getApiBaseUrlAsync,
};
