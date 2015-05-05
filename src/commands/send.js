var co = require('co');

var api = require('../api');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'send',
  description: "Sends a link you can load the app you're developing to a phone number or e-mail address",
  help: "You must have the server running for this command to work",
  runAsync: co.wrap(function *(env) {
    var argv = env.argv;
    var args = argv._;
    var err = null;

    try {
      var url = yield urlUtil.getTestedMainBundleUrlAsync();
    } catch (e) {
      err = new Error("You need to run `exp serve` before you have a URL you can send");
      throw err;
    }

    var recipient = args[1];
    if (!recipient) {
      throw new Error("You must specify a phone number or e-mail address to send the link to");
    }
    
    return yield api.callMethodAsync('send', [recipient, url]);

  }),
};
