var crayon = require('@ccheever/crayon');
var qrcodeTerminal = require('qrcode-terminal');
var simpleSpinner = require('@exponent/simple-spinner');

import {
  UrlUtils,
} from 'xdl';

var log = require('../log');
var urlOpts = require('../urlOpts');

module.exports = {
  name: 'url',
  args: ["[project-dir]"],
  options: [
    ['--qr', "Will also generate a QR code for the URL"],
    ...(urlOpts.options()),
  ],
  description: "Displays the URL you can use to view your project in Exponent",
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
  },
};
