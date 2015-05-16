var simpleSpinner = require('@exponent/simple-spinner');

var api = require('../api');
var log = require('../log');


async function sendUrlAysnc(url, recipient) {
  log("Sending URL to", recipient);
  simpleSpinner.start();
  var result = await api.callMethodAsync('send', [recipient, url]);
  simpleSpinner.stop();
  log("Sent.");
  return result;
}

module.exports = {
  sendUrlAysnc,
}
