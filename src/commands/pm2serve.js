var child_process = require('child_process');
var crayon = require('@ccheever/crayon');
var delayAsync = require('delay-async');
var freeportAsync = require('freeport-async');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var md5hex = require('@exponent/md5hex');
var path = require('path');
var pm2 = require('pm2');
var simpleSpinner = require('@exponent/simple-spinner');

import {
  RunPackager,
  UrlUtils,
  UserSettings,
} from 'xdl';

var askUser = require('../askUser');
var CommandError = require('../CommandError');
var config = require('../config');
var log = require('../log');
var sendTo = require('../sendTo');
var urlOpts = require('../urlOpts');

function packageJsonFullPath() {
  return path.resolve('package.json');
}

async function pm2NameAsync() {
  var packageName = await jsonFile.getAsync('package.json', 'name');
  var pkgJsonHash = md5hex(packageJsonFullPath(), 8);
  return 'exp-serve/' + packageName + ':' + pkgJsonHash;
}

async function getPm2AppByIdAsync(id) {
  // N.B. You need to be connected to PM2 for this to work
  var apps = await pm2.promise.list();
  for (var app of apps) {
    if (app.pm_id === id) {
      return app;
    }
  }
}

async function setupServeAsync(env) {
  var argv = env.argv;
  var args = argv._;

  // If a project-dir is provided, change to that directory
  var projectDir = args[1];
  if (projectDir) {
    process.chdir(projectDir);
  }
}

async function getPm2AppByNameAsync(name) {
  var a = null;
  var apps = await pm2.promise.list();
  for (var app of apps) {
    if (app.name === name) {
      a = app;
    }
  }
  return a;
}

async function waitForRunningAsync(expFile) {
  var state = await expFile.getAsync('state', null);
  if (state === 'RUNNING') {
    return true;
  } else {
    await delayAsync(500);
    return waitForRunningAsync(expFile);
  }
}

module.exports = {
  start: {
    name: 'start',
    description: "Starts or restarts a local server to serve your app and gives you a URL to it",
    args: ["[project-dir]"],
    options: [
      ['--send-to', "A phone number or e-mail address to send a link to"],
      ...(urlOpts.options()),
    ],
    help: "Starts a local server to serve your app and gives you a URL to it.\n" +
      "[project-dir] defaults to '.'",
    runAsync: async function (env) {
      var argv = env.argv;
      var args = argv._;
      var projectDir = args[1] || process.cwd();

      await setupServeAsync(env);

      // If run without --nodaemon, we spawn a new pm2 process that runs
      // the same command with --nodaemon added.
      if (!argv.nodaemon) {
        await urlOpts.optsFromEnvAsync(env);

        var [pm2Name, pm2Id] = await Promise.all([
          pm2NameAsync(),
          config.projectExpJsonFile(projectDir).getAsync('pm2Id', null),
        ]);

        var script = process.argv[1];
        var args_ = process.argv.slice(2);
        args_.push('--nodaemon');

        await pm2.promise.connect();
        await config.projectExpJsonFile(projectDir).writeAsync({pm2Id, pm2Name, state: 'STARTING'});

        // There is a race condition here, but let's just not worry about it for now...
        var needToStart = true;
        if (pm2Id != null) {
          // If this is already being managed by pm2, then restart it
          var app = await getPm2AppByNameAsync(pm2Name);
          if (app) {
            log("pm2 managed process exists; restarting it");
            await pm2.promise.restart(app.pm_id);
            //var app_ = await getPm2AppByIdAsync(pm2Id);
            needToStart = false;
          } else {
            log("Can't find pm2 managed process", pm2Id, " so will start a new one");
            await config.projectExpJsonFile(projectDir).deleteKeyAsync('pm2Id');
          }
        }

        if (needToStart) {
          log("Starting exp-serve process under pm2");

          // If it's not being managed by pm2 then start it
          var _apps = await pm2.promise.start({
            name: pm2Name,
            script: script,
            args: args_,
            watch: false,
            cwd: process.cwd(),
            env: process.env,
          });
        }

        var app = await getPm2AppByNameAsync(pm2Name);
        if (app) {
          await config.projectExpJsonFile(projectDir).mergeAsync({pm2Name, pm2Id: app.pm_id});
        } else {
          throw CommandError('PM2_ERROR_STARTING_PROCESS', env, "Something went wrong starting exp serve:");
        }

        await pm2.promise.disconnect();

        var recipient;
        if (!!argv['send-to']) {
          if (!!argv['send-to'] != argv['send-to']) { // not a boolean
            recipient = argv['send-to'];
          } else {
            recipient = await UserSettings.getAsync('sendTo', null);
          }

          if (!recipient) {
            recipient = await askUser.askForSendToAsync();
          }
        }

        log("Waiting for packager, etc. to start");
        simpleSpinner.start();
        await waitForRunningAsync(config.projectExpJsonFile(projectDir));
        simpleSpinner.stop();
        log("Exponent is ready.");

        let url = await UrlUtils.constructManifestUrlAsync(projectDir);
        log("Your URL is\n\n" + crayon.underline(url) + "\n");

        if (recipient) {
          await sendTo.sendUrlAsync(url, recipient);
        }

        return config.projectExpJsonFile(projectDir).readAsync();
      }

      log(crayon.gray("Using project at", process.cwd()));

      let pc = await RunPackager.runAsync({
        root: path.resolve(process.cwd()),
      });

      pc.on('stdout', console.log);
      pc.on('stderr', console.log);

      await pc.startAsync();

      config.projectExpJsonFile(projectDir).mergeAsync({
        err: null,
        state: 'RUNNING',
      });

      return config.projectExpJsonFile(projectDir).readAsync();
    },
  },
  stop: {
    name: 'stop',
    description: "Stops the server",
    args: ["[project-dir]"],
    runAsync: async function (env) {
      var argv = env.argv;
      var args = argv._;
      var projectDir = args[1] || process.cwd();

      await setupServeAsync(env);

      await pm2.promise.connect();
      try {
        log("Stopping the server...");
        await pm2.promise.stop(await pm2NameAsync());
      } catch (e) {
        log.error("Failed to stop the server\n" + e.message);
      }
      await pm2.promise.disconnect();
      await config.projectExpJsonFile(projectDir).mergeAsync({state: 'STOPPED'});
      log("Stopped.");
    },
  },
  pm2NameAsync,
  setupServeAsync,
};
