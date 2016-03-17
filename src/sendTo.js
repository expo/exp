var simpleSpinner = require('@exponent/simple-spinner');

var api = require('../api');
var log = require('../log');


async function sendUrlAsync(url, recipient) {
  log("Sending URL to", recipient);
  simpleSpinner.start();
  try {
    var result = await api.callMethodAsync('send', [recipient, url]);
  } finally {
    simpleSpinner.stop();
  }
  log("Sent.");
  return result;
}

module.exports = {
  sendUrlAsync,
}
