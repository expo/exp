'use strict';

var child_process = require('child_process');
var co = require('co');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var ngrok = require('ngrok');
var path = require('path');

var config = require('../config');
var log = require('../log');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'serve',
  description: 'Starts a local server to serve your app and gives you a URL to it',
  options: [['--path', 'The path to the place where your package is', '.'], ['--port', 'The port to run the server on', 'Random (9000-9999)'], ['--ngrokSubdomain', 'The ngrok subdomain to use', config.ngrok && config.ngrok.subdomain], ['--ngrokAuthToken', 'The ngrok authToken to use', config.ngrok && config.ngrok.authToken]],
  help: 'Starts a local server to serve your app and gives you a URL to it',
  runAsync: co.wrap(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var ngrokSubdomain = argv['ngrok-subdomain'] || config.ngrok && config.ngrok.subdomain || undefined;
    var ngrokAuthToken = argv['ngrok-auth-token'] || config.ngrok && config.ngrok.authToken || undefined;

    var port = argv.port;
    if (port == null) {
      port = 9000 + Math.floor(Math.random() * 1000);
    }

    var urlP = ngrok.promise.connect({
      port: port,
      authtoken: ngrokAuthToken,
      subdomain: ngrokSubdomain });

    //var root = path.resolve(__dirname, '..', '..');
    var root = config.absolutePath;
    var packager = child_process.spawn(config.packagerPath, ['--port=' + port, '--root=' + root, '--assetRoots=' + root], {
      stdio: [process.stdin, process.stdout, process.stderr] });

    var url = yield urlP;
    // Store the URL in a file
    yield urlUtil.writeUrlFileAsync(url);

    log('Started packager and ngrok');
    log('Your URL is\n' + crayon.bold(url) + '\n');
  }) };
//# sourceMappingURL=../sourcemaps/commands/serve.js.map