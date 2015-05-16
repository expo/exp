'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var sendUrlAysnc = _asyncToGenerator(function* (url, recipient) {
  log('Sending URL to', recipient);
  simpleSpinner.start();
  try {
    var result = yield api.callMethodAsync('send', [recipient, url]);
  } finally {
    simpleSpinner.stop();
  }
  log('Sent.');
  return result;
});

var simpleSpinner = require('@exponent/simple-spinner');

var api = require('../api');
var log = require('../log');

module.exports = {
  sendUrlAysnc: sendUrlAysnc };
//# sourceMappingURL=../sourcemaps/commands/sendTo.js.map