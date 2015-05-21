'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var child_process = require('child_process');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var qrcodeTerminal = require('qrcode-terminal');
var simpleSpinner = require('@exponent/simple-spinner');

var CommandError = require('./CommandError');
var log = require('../log');
var sendTo = require('./sendTo');
var urlOpts = require('./urlOpts');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'web',
  options: [['--test', 'Will test to make sure the URL is valid']],
  description: 'Opens your article in a web simulator you can view in your browser',
  help: 'You must have the server running for this command to work. This command will also display' + ' a URL you can copy/paste and send to other people to view on their computers, etc.',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    var url = yield urlUtil.urlFromEnvAsync(env);
    var appetizeUrl = yield (yield urlUtil.appetizeWebSimulatorUrlAsync(url));

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

    log('Opening article in web simulator...');
    console.log();
    console.log(crayon.underline(appetizeUrl));
    console.log();

    if (process.platform === 'darwin') {
      var result = yield child_process.promise.exec('open ' + appetizeUrl, { stdio: 'inherit' });
    } else {
      log.error('Sorry, opening the URL for the web simulator automatically only works on Mac for now.');
    }

    return appetizeUrl;
  }) };
//# sourceMappingURL=../sourcemaps/commands/web.js.map