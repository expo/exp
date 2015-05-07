var co = require('co');
//var crayon = require('@ccheever/crayon');
//var qrcodeTerminal = require('qrcode-terminal');

var api = require('../api');
var CommandError = require('./CommandError');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'url',
  description: "Sends a link you can load the app you're developing to a phone number or e-mail address",
  help: "You must have the server running for this command to work",
  runAsync: co.wrap(function *(env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    try {
      var url = yield urlUtil.getTestedMainBundleUrlAsync();
    } catch (e) {
      throw CommandError('RUN_EXP_SERVE_FIRST', env, "You need to run `exp serve` before you have a URL you can send");
    }
    var expUrl = urlUtil.expUrlFromHttpUrl(url);
    var recipient = args[1];
    if (recipient) {
      return yield api.callMethodAsync('send', [recipient, expUrl]);
    } else {
      console.log(expUrl);
      // TODO: If we can make the URLs shorter, show a QR code
      /*
      crayon.bold.log(url);
      console.log('');
      qrcodeTerminal.generate(url);
      console.log('');
      crayon.bold.log(url);
      */
    }

  }),
};
