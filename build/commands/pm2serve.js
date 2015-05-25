'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var pm2NameAsync = _asyncToGenerator(function* () {
  var packageName = yield jsonFile.getAsync('package.json', 'name');
  var pkgJsonHash = md5hex(packageJsonFullPath(), 8);
  return 'exp-serve/' + packageName + ':' + pkgJsonHash;
});

var getPm2AppByIdAsync = _asyncToGenerator(function* (id) {
  // N.B. You need to be connected to PM2 for this to work
  var apps = yield pm2.promise.list();
  for (var app of apps) {
    if (app.pm_id === id) {
      return app;
    }
  }
});

var setupServeAsync = _asyncToGenerator(function* (env) {
  var argv = env.argv;
  var args = argv._;

  // If a project-dir is provided, change to that directory
  var projectDir = args[1];
  if (projectDir) {
    process.chdir(projectDir);
  }
});

var getPm2AppByNameAsync = _asyncToGenerator(function* (name) {
  var a = null;
  var apps = yield pm2.promise.list();
  for (var app of apps) {
    if (app.name === name) {
      a = app;
    }
  }
  return a;
});

var child_process = require('child_process');
var crayon = require('@ccheever/crayon');
var freeportAsync = require('freeport-async');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var md5hex = require('@exponent/md5hex');
var path = require('path');
var pm2 = require('pm2');
var simpleSpinner = require('@exponent/simple-spinner');

var askUser = require('../askUser');
var CommandError = require('./CommandError');
var config = require('../config');
var log = require('../log');
var sendTo = require('../commands/sendTo');
var serveAsync = require('../serve/serveAsync');
var urlUtil = require('../urlUtil');
var userSettings = require('../userSettings');
var waitForRunningAsync = require('../serve/waitForRunningAsync');

function packageJsonFullPath() {
  return path.resolve('package.json');
}

module.exports = {
  start: {
    name: 'start',
    description: 'Starts or restarts a local server to serve your app and gives you a URL to it',
    args: ['[project-dir]'],
    options: [['--path', 'The path to the place where your package is', '.'], ['--port', 'The port to run the server on', 'Random free port'],
    //['--ngrokSubdomain', "The ngrok subdomain to use", (config.ngrok && config.ngrok.subdomain)],
    //['--ngrokAuthToken', "The ngrok authToken to use", (config.ngrok && config.ngrok.authToken)],
    ['--sendTo', 'A phone number or e-mail address to send a link to'], ['--nosend', 'Don\'t ask about sending a link to the server']],
    help: 'Starts a local server to serve your app and gives you a URL to it.\n' + '[project-dir] defaults to \'.\'\n' + '\n' + 'If you don\'t specify a port, a random, free port will be chosen automatically.',
    runAsync: _asyncToGenerator(function* (env) {
      var argv = env.argv;
      var args = argv._;

      yield setupServeAsync(env);

      if (!argv.nodaemon) {
        //log("Using pm2");

        var _ref = yield _Promise.all([pm2NameAsync(), config.expInfoFile.getAsync('pm2Id', null)]);

        var _ref2 = _slicedToArray(_ref, 2);

        var pm2Name = _ref2[0];
        var pm2Id = _ref2[1];

        var bin = process.argv[0];
        var script = process.argv[1];
        var args_ = process.argv.slice(2);
        args_.push('--nodaemon');

        yield pm2.promise.connect();

        yield config.expInfoFile.writeAsync({ pm2Id: pm2Id, pm2Name: pm2Name, state: 'STARTING' });

        // There is a race condition here, but let's just not worry about it for now...
        var needToStart = true;
        if (pm2Id) {

          // If this is already being managed by pm2, then restart it
          //var app = await getPm2AppByIdAsync(pm2Id);
          var app = yield getPm2AppByNameAsync(pm2Name);
          if (app) {
            log('pm2 managed process exists; restarting it');
            yield pm2.promise.restart(app.pm_id);
            //var app_ = await getPm2AppByIdAsync(pm2Id);
            needToStart = false;
          } else {
            log('Can\'t find pm2 managed process', pm2Id, ' so will start a new one');
            yield config.expInfoFile.deleteKeyAsync('pm2Id');
          }
        }

        if (needToStart) {
          log('Starting exp-serve process under pm2');

          // If it's not being managed by pm2 then start it
          var _apps = yield pm2.promise.start({
            name: pm2Name,
            script: script,
            args: args_,
            watch: false,
            cwd: process.cwd(),
            env: process.env });
        }

        var app = yield getPm2AppByNameAsync(pm2Name);

        if (app) {
          yield config.expInfoFile.mergeAsync({ pm2Name: pm2Name, pm2Id: app.pm_id });
        } else {
          throw CommandError('PM2_ERROR_STARTING_PROCESS', env, 'Something went wrong starting exp serve:');
        }

        yield pm2.promise.disconnect();

        var recipient = argv.sendTo || null;
        if (!recipient && !argv.nosend) {
          recipient = yield askUser.askForMobileNumberAsync();
        }

        log('Waiting for packager, etc. to start');
        simpleSpinner.start();
        yield waitForRunningAsync(config.expInfoFile);
        simpleSpinner.stop();
        log('Exponent is ready.');

        var httpUrl = yield urlUtil.mainBundleUrlAsync({ type: 'ngrok' });
        var url = urlUtil.expUrlFromHttpUrl(httpUrl);
        log('Your URL is\n\n' + crayon.underline(url) + '\n');

        if (recipient) {
          yield sendTo.sendUrlAsync(url, recipient);
        }

        return config.expInfoFile.readAsync();
      }

      log(crayon.gray('Using project at', process.cwd()));
      var mainModulePath = yield urlUtil.guessMainModulePathAsync();
      var entryPoint = yield urlUtil.entryPointAsync();
      log(crayon.gray('Using mainModulePath of', mainModulePath, 'and an entry point of', entryPoint));

      var ngrokSubdomain = argv['ngrok-subdomain'] || config.ngrok && config.ngrok.subdomain || undefined;
      var ngrokAuthToken = argv['ngrok-auth-token'] || config.ngrok && config.ngrok.authToken || undefined;

      var port = argv.port || (yield freeportAsync(9000));
      yield serveAsync({ port: port });

      return config.expInfoFile.readAsync();
    }) },
  stop: {
    name: 'stop',
    description: 'Stops the server',
    runAsync: _asyncToGenerator(function* (env) {
      yield pm2.promise.connect();
      try {
        log('Stopping the server...');
        yield pm2.promise.stop((yield pm2NameAsync()));
      } catch (e) {
        log.error('Failed to stop the server\n' + e.message);
      }
      yield pm2.promise.disconnect();
      yield config.expInfoFile.updateAsync({ state: 'STOPPED' });
      log('Stopped.');
    }) },
  pm2NameAsync: pm2NameAsync,
  setupServeAsync: setupServeAsync };
//# sourceMappingURL=../sourcemaps/commands/pm2serve.js.map