'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var crayon = require('@ccheever/crayon');
var qrcodeTerminal = require('qrcode-terminal');
var simpleSpinner = require('@exponent/simple-spinner');

var askUser = require('../askUser');
var CommandError = require('./CommandError');
var log = require('../log');
var sendTo = require('./sendTo');
var urlOpts = require('./urlOpts');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'send',
  args: ['[recipient]'],
  options: [['--sendTo', 'Specifies the mobile number or e-mail address to send this URL to'], ['--qr', 'Will also generate a QR code for the URL'], ['--test', 'Will test to make sure the URL is valid']].concat(_toConsumableArray(urlOpts.options('ngrok'))),
  description: 'Sends a link you can load the app you\'re developing to a phone number or e-mail address',
  help: 'You must have the server running for this command to work',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    var url = yield urlUtil.urlFromEnvAsync(env);

    log('Your URL is\n\n' + crayon.underline(url) + '\n');

    var recipient = argv.sendTo || args[1];
    if (!recipient) {
      recipient = yield askUser.askForMobileNumberAsync();
    }

    var test = !argv.notest;
    if (test) {
      log('Testing loading the URL...');
      simpleSpinner.start();
      try {
        var ok = yield urlUtil.testUrlAsync(httpUrl);
      } catch (e) {
        throw CommandError('RUN_EXP_START_FIRST', env, 'You may need to run `exp start` to get a URL\n' + e.message);
      } finally {
        simpleSpinner.stop();
      }
      log('OK.');
    }

    if (recipient) {
      yield sendTo.sendUrlAysnc(url, recipient);
    } else {
      log.gray('(Not sending anything because you didn\'t specify a recipient.)');
    }
  }) };
//# sourceMappingURL=../sourcemaps/commands/send.js.map