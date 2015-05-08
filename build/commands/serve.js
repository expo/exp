'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var child_process = require('child_process');
var co = require('co');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var ngrok = require('ngrok');
var path = require('path');
var simpleSpinner = require('simple-spinner');
var stream = require('stream');

var config = require('../config');
var log = require('../log');
var urlUtil = require('../urlUtil');
var userSettings = require('../userSettings');
var waitAsync = require('../waitAsync');

module.exports = {
  name: 'serve',
  description: 'Starts a local server to serve your app and gives you a URL to it',
  options: [['--path', 'The path to the place where your package is', '.'], ['--port', 'The port to run the server on', 'Random (9000-9999)'], ['--ngrokSubdomain', 'The ngrok subdomain to use', config.ngrok && config.ngrok.subdomain], ['--ngrokAuthToken', 'The ngrok authToken to use', config.ngrok && config.ngrok.authToken], ['--send', 'An e-mail address or phone number to send a link to']],
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
      stdio: [process.stdin, 'pipe', process.stderr] });

    var outStream = new stream.Writable();
    outStream.buffer = '';
    outStream._write = function (chunk, encoding, done) {
      outStream.buffer += chunk.toString();
      done();
    };

    var packagerReady = new _Promise(function (fulfill, reject) {

      var packagerBuffer = '';
      packager.stdout.on('readable', function () {
        var chunk;
        while (null !== (chunk = packager.stdout.read())) {
          packagerBuffer += chunk.toString();
          if (packagerBuffer.match(/React packager ready\./)) {
            packager.stdout.pipe(outStream);
            fulfill(packagerBuffer);
            break;
          }
        }
      });
    });

    var urlWrittenP = urlP.then(function (ngrokUrl) {
      return urlUtil.writeUrlFileAsync(ngrokUrl);
    });

    log(crayon.gray('The packager is starting up and building your initial bundle...'));
    simpleSpinner.start();

    var _ref = yield [urlWrittenP, packagerReady];

    var _ref2 = _slicedToArray(_ref, 2);

    var ngrokUrl = _ref2[0];
    var packagerBuffer = _ref2[1];

    //log(crayon.green("Started packager and ngrok"));

    var httpUrl = yield urlUtil.getTestedMainBundleUrlAsync();
    var expUrl = urlUtil.expUrlFromHttpUrl(httpUrl);

    simpleSpinner.stop();
    console.log(crayon.green(expUrl) + '\n');

    packager.stdout.pipe(process.stdout);
    console.log(crayon.gray(outStream.buffer));

    // TODO: Add sending stuff
  }) };
//# sourceMappingURL=../sourcemaps/commands/serve.js.map