/**
 * Makes an API call to exp.host
 *
 */

var co = require('co');
var instapromise = require('instapromise');
var request = require('request');

var HOST = 'exp.host';
var PORT = 80;

var callMethodAsync = co.wrap(function*(methodName, args) {
  // TODO: Make this configurable at some point
  var baseUrl = 'http://' + HOST + ':' + PORT + '/__api__';
  var url = baseUrl + '/' + encodeURIComponent(methodName) + '/' + encodeURIComponent(JSON.stringify(args));
  //console.log("url=", url);
  var response = yield request.promise.post(url);
  var body = response.body;
  try {
    return JSON.parse(body);
  } catch (e) {
    var err = new Error("Unparseable response from API server: " + body);
    throw err;
  }
});

module.exports = {
  callMethodAsync,
};
