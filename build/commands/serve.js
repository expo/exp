'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var child_process = require('child_process');
var co = require('co');
var crayon = require('@ccheever/crayon');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');
var ngrok = require('ngrok');
var path = require('path');
var simpleSpinner = require('simple-spinner');
var stream = require('stream');

var api = require('../api');
var config = require('../config');
var log = require('../log');
var urlUtil = require('../urlUtil');
var userSettings = require('../userSettings');

module.exports = {
  name: 'serve',
  description: 'Starts a local server to serve your app and gives you a URL to it',
  args: ['[project-dir]'],
  options: [['--path=PATH', 'The path to the place where your package is', '.'], ['--port=PORT', 'The port to run the server on', 'Random (9000-9999)'], ['--ngrokSubdomain=SUBDOMAIN', 'The ngrok subdomain to use', config.ngrok && config.ngrok.subdomain], ['--ngrokAuthToken=AUTH_TOKEN', 'The ngrok authToken to use', config.ngrok && config.ngrok.authToken], ['--send=EMAIL_OR_PHONE_NUMBER', 'An e-mail address or phone number to send a link to']],
  help: 'Starts a local server to serve your app and gives you a URL to it',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;

    // If a project-dir is provided, change to that directory
    var projectDir = args[1];
    if (projectDir) {
      process.chdir(projectDir);
      log(crayon.gray('Using project at', process.cwd()));
    }

    // TODO: These two functions are sort of redundant
    var mainModulePath = yield urlUtil.guessMainModulePathAsync();
    var entryPoint = yield urlUtil.entryPointAsync();
    log(crayon.gray('Using mainModulePath of', mainModulePath, 'and an entry point of', entryPoint));

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

    var waitingForUrl = true;

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

    var sendTo = argv.send;
    if (sendTo === true) {
      var settings = userSettings.readFileAsync();
      sendTo = args[1] || settings.phoneNumber || settings.email || null;
    }

    var waitingForUserInput = false;

    if (!sendTo) {
      console.log('Enter a phone number or an e-mail address if you want to have');
      console.log('a link to view this project sent to your phone');

      waitingForUserInput = true;
      inquirerAsync.promptAsync([{
        type: 'input',
        name: 'sendTo',
        message: 'Mobile number or e-mail address (optional):' }]).then(function (answers) {
        waitingForUserInput = false;
        if (waitingForUrl) {
          simpleSpinner.start();
          sendTo = answers.sendTo;
        }
      }, function (err) {
        log.error(err);
      });;
    }

    var _yield = _slicedToArray(yield[(urlWrittenP, packagerReady)], 2);

    var ngrokUrl = _yield[0];
    var packagerBuffer = _yield[1];

    //log(crayon.green("Started packager and ngrok"));

    var httpUrl = yield urlUtil.getTestedMainBundleUrlAsync();
    var expUrl = urlUtil.expUrlFromHttpUrl(httpUrl);

    waitingForUrl = false;

    if (waitingForUserInput) {
      // This clears the line and hits enter, but it doens't actually
      // cause inquirer to return answers
      process.stdin.write('\u001b[2K\n');
    } else {
      simpleSpinner.stop();
    }
    console.log('\nVisit this URL in the Exponent app on your phone to view this project:\n' + crayon.green(expUrl) + '\n');

    log(crayon.gray('Packager is running on port ' + port));
    console.log(crayon.gray(packagerBuffer));
    console.log(crayon.gray(outStream.buffer));
    packager.stdout.pipe(process.stdout);

    if (sendTo) {
      log(crayon.gray('Sending URL to', sendTo));
      try {
        var result = yield urlUtil.sendUrlAsync(sendTo, expUrl);
      } catch (e) {
        log.error('Failed to send link to', sendTo);
      }
    }
  }) };
//# sourceMappingURL=../sourcemaps/commands/serve.js.map