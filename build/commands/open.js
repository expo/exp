'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var CommandError = require('./CommandError');
var log = require('../log');
var simulator = require('../simulator');
var urlOpts = require('./urlOpts');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'open',
  description: 'Opens your app in Exponent in a currently running simulator on your computer',
  help: 'You must already have Exponent installed on a simulator on your computer ' + 'for this command to work. If you don\'t already, you can try `exp start-simulator`',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var url = args[1];
    if (!url) {
      try {
        var uo = urlOpts.optsFromEnv(env, { type: 'localhost' });
        var httpUrl = yield urlUtil.mainBundleUrlAsync(uo);
      } catch (e) {
        throw CommandError('EXP_START_FIRST', env, 'No URL detected; try running `exp start` first');
      }
      url = urlUtil.expUrlFromHttpUrl(httpUrl);
    }
    log(url);

    return simulator.openUrlOnSimulatorAsync(url);
  }) };
//# sourceMappingURL=../sourcemaps/commands/open.js.map