var simpleSpinner = require('@exponent/simple-spinner');
var log = require('./log');

import {
  Api,
} from 'xdl';

async function sendUrlAsync(url, recipient) {
  log("Sending URL to", recipient);
  simpleSpinner.start();
  try {
    var result = await Api.callMethodAsync('send', [recipient, url]);
  } finally {
    simpleSpinner.stop();
  }
  log("Sent.");
  return result;
}

module.exports = {
  sendUrlAsync,
}
