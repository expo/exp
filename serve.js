#!/usr/bin/env node

var child_process = require('child_process');
var co = require('co');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var minimist = require('minimist');
var ngrok = require('ngrok');
var path = require('path');

module.exports = function(command, argv) {
  switch (command) {
    case 'start':
    case void 0:
    return co(function*() {
      var ngrokAuthToken, ngrokSubdomain, packager, port, url, urlP;
      ngrokSubdomain = argv['ngrok-subdomain'];
      ngrokAuthToken = argv['ngrok-auth-token'];
      port = argv.port;
      if (port == null) {
        port = 9000 + Math.floor(Math.random() * 1000);
      }
      urlP = ngrok.promise.connect({
        port: port,
        authtoken: ngrokAuthToken,
        subdomain: ngrokSubdomain
      });
      var pp = path.join(__dirname, 'node_modules', 'react-native', 'packager', 'packager.sh');
      var root = path.resolve(__dirname, '..', '..');
      packager = child_process.spawn(pp, ["--port=" + port, "--root=" + root, "--assetRoots=" + root,], {
        stdio: [process.stdin, process.stdout, process.stderr],
      });
      url = (yield [urlP])[0];
      return crayon.log("Started packager and ngrok\nYour URL is\n" + (crayon.bold(url)) + "\n");
    });
    default:
    return console.error("The only command that works right now is `start`");
  }
};

if (require.main === module) {
  argv = minimist(process.argv.slice(2));
  module.exports(argv._[0], argv);
}
