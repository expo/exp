'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var crayon = require('@ccheever/crayon');
var qrcodeTerminal = require('qrcode-terminal');
var simpleSpinner = require('@exponent/simple-spinner');

var CommandError = require('./CommandError');
var log = require('../log');
var sendTo = require('./sendTo');
var urlOpts = require('./urlOpts');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'url',
  args: ['[recipient]'],
  options: [['--sendTo', 'Specifies the mobile number or e-mail address to send this URL to'], ['--qr', 'Will also generate a QR code for the URL'], ['--test', 'Will test to make sure the URL is valid']].concat(_toConsumableArray(urlOpts.options('ngrok'))),
  description: 'Displays the URL you can use to view your project in Exponent',
  help: 'You must have the server running for this command to work',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    var url = yield urlUtil.urlFromEnvAsync(env);

    console.log(url);

    if (argv.qr) {
      qrcodeTerminal.generate(url);
    }

    var test = argv.test;
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

    var recipient = argv.sendTo || args[1];

    if (recipient) {
      yield sendTo.sendUrlAysnc(url, recipient);
    }

    return url;
  }) };
//# sourceMappingURL=../sourcemaps/commands/url.js.map