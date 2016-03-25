var crayon = require('@ccheever/crayon');
var qrcodeTerminal = require('qrcode-terminal');
var simpleSpinner = require('@exponent/simple-spinner');

import {
  UrlUtils,
} from 'xdl';

var askUser = require('../askUser');
var log = require('../log');
var sendTo = require('../sendTo');
var urlOpts = require('../urlOpts');

module.exports = {
  name: 'send',
  args: ["[project-dir]"],
  options: [
    ['--send-to', "Specifies the mobile number or e-mail address to send this URL to"],
    ['--qr', "Will also generate a QR code for the URL"],
    ...(urlOpts.options('ngrok')),
  ],
  description: "Sends a link you can load the app you're developing to a phone number or e-mail address",
  help: "You must have the server running for this command to work",
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var projectDir = args[1] || process.cwd();

    await urlOpts.optsFromEnvAsync(env);

    let url = await UrlUtils.constructManifestUrlAsync(projectDir);

    log("Your URL is\n\n" + crayon.underline(url) + "\n");

    if (argv.qr) {
      qrcodeTerminal.generate(url);
      return;
    }

    var recipient;
    if (!!argv['send-to'] != argv['send-to']) { // not a boolean
      recipient = argv['send-to'];
    } else {
      recipient = await UserSettings.getAsync('sendTo', null);
    }

    if (!recipient) {
      recipient = await askUser.askForSendToAsync();
    }

    if (recipient) {
      await sendTo.sendUrlAsync(url, recipient);
    } else {
      log.gray("(Not sending anything because you didn't specify a recipient.)");
    }
  },
};
