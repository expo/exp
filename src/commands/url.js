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
  options: [
    ['--sendTo', "Specifies the mobile number or e-mail address to send this URL to"],
    ['--qr', "Will also generate a QR code for the URL"],
    ['--test', "Will test to make sure the URL is valid"],
    ...(urlOpts.options('ngrok')),
  ],
  description: "Displays the URL you can use to view your project in Exponent",
  help: "You must have the server running for this command to work",
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    var uo = urlOpts.optsFromEnv(env, {type: 'ngrok'});

    try {
      var httpUrl = await urlUtil.mainBundleUrlAsync(uo);
    } catch (e) {
      throw CommandError('NO_URL', env, "There doesn't seem to be a URL for this package. Try running `exp start` first.\n" + e.message);
    }

    var url = httpUrl;
    if (!argv.http) {
      url = urlUtil.expUrlFromHttpUrl(url);
    }

    if (argv.redirect) {
      url = await urlUtil.httpRedirectUrlAsync(url);
    }

    console.log(url);

    if (argv.qr) {
      qrcodeTerminal.generate(url);
    }

    var test = argv.test;
    if (test) {
      log("Testing loading the URL...");
      simpleSpinner.start();
      try {
        var ok = await urlUtil.testUrlAsync(httpUrl);
      } catch (e) {
        throw CommandError('RUN_EXP_START_FIRST', env, "You may need to run `exp start` to get a URL\n" + e.message);
      } finally {
        simpleSpinner.stop();
      }
      log("OK.");
    }

    var recipient = argv.sendTo || args[1];

    if (recipient) {
      await sendTo.sendUrlAysnc(url, recipient);
    }

    return url;

  },
};
