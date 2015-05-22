var CommandError = require('./CommandError');
var log = require('../log');
var simulator = require('../simulator');
var urlOpts = require('./urlOpts');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'simulator',
  description: "Opens your article on the simulator",
  help: "(Only works on Macs with Xcode installed)",
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var url = args[1];
    if (!url) {
      try {
        var uo = urlOpts.optsFromEnv(env, { type: 'localhost' });
        var httpUrl = await urlUtil.mainBundleUrlAsync(uo);
      } catch (e) {
        throw CommandError('EXP_START_FIRST', env, "No URL detected; try running `exp start` first");
      }
      url = urlUtil.expUrlFromHttpUrl(httpUrl);
    }
    log(url);
    log("Only the iPhone 6 simulator works right now (TODO)");
    await simulator.openUrlInUserChosenSimulatorAsync(url);
    log("Opening URL in simulator...");
    return url;
  },
};
