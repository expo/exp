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
var CommandError = require('../CommandError');
var config = require('../config');
var log = require('../log');
var sendTo = require('../sendTo');
var serveAsync = require('../serve/serveAsync');
var urlUtil = require('../urlUtil');
var userSettings = require('../userSettings');
var waitForRunningAsync = require('../serve/waitForRunningAsync');

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

module.exports = {
  start: {
    name: 'start',
    description: "Starts or restarts a local server to serve your app and gives you a URL to it",
    args: ["[project-dir]"],
    options: [
      ['--path', "The path to the place where your package is", '.'],
      ['--port', "The port to run the server on", "Random free port"],
      //['--ngrokSubdomain', "The ngrok subdomain to use", (config.ngrok && config.ngrok.subdomain)],
      //['--ngrokAuthToken', "The ngrok authToken to use", (config.ngrok && config.ngrok.authToken)],
      ['--sendTo', "A phone number or e-mail address to send a link to"],
      ['--nosend', "Don't ask about sending a link to the server"],
    ],
    help: "Starts a local server to serve your app and gives you a URL to it.\n" +
      "[project-dir] defaults to '.'\n" +
      "\n" +
      "If you don't specify a port, a random, free port will be chosen automatically.",
    runAsync: async function (env) {
      var argv = env.argv;
      var args = argv._;

      await setupServeAsync(env);

      if (!argv.nodaemon) {
        var [pm2Name, pm2Id] = await Promise.all([
          pm2NameAsync(),
          config.expInfoFile.getAsync('pm2Id', null),
        ]);

        var bin = process.argv[0];
        var script = process.argv[1];
        var args_ = process.argv.slice(2);
        args_.push('--nodaemon');

        await pm2.promise.connect();

        await config.expInfoFile.writeAsync({pm2Id, pm2Name, state: 'STARTING'});

        // There is a race condition here, but let's just not worry about it for now...
        var needToStart = true;
        if (pm2Id) {

          // If this is already being managed by pm2, then restart it
          //var app = await getPm2AppByIdAsync(pm2Id);
          var app = await getPm2AppByNameAsync(pm2Name);
          if (app) {
            log("pm2 managed process exists; restarting it");
            await pm2.promise.restart(app.pm_id);
            //var app_ = await getPm2AppByIdAsync(pm2Id);
            needToStart = false;
          } else {
            log("Can't find pm2 managed process", pm2Id, " so will start a new one");
            await config.expInfoFile.deleteKeyAsync('pm2Id');
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
          await config.expInfoFile.mergeAsync({pm2Name, pm2Id: app.pm_id});
        } else {
          throw CommandError('PM2_ERROR_STARTING_PROCESS', env, "Something went wrong starting exp serve:");
        }

        await pm2.promise.disconnect();

        var recipient = argv.sendTo || null;
        if (!recipient && !argv.nosend) {
          recipient = await askUser.askForMobileNumberAsync();
        }

        log("Waiting for packager, etc. to start");
        simpleSpinner.start();
        await waitForRunningAsync(config.expInfoFile);
        simpleSpinner.stop();
        log("Exponent is ready.");

        var httpUrl = await urlUtil.mainBundleUrlAsync({type: 'ngrok'});
        var url = urlUtil.expUrlFromHttpUrl(httpUrl);
        log("Your URL is\n\n" + crayon.underline(url) + "\n");

        if (recipient) {
          await sendTo.sendUrlAsync(url, recipient);
        }

        return config.expInfoFile.readAsync();
      }

      log(crayon.gray("Using project at", process.cwd()));
      var mainModulePath = await urlUtil.guessMainModulePathAsync();
      var entryPoint = await urlUtil.entryPointAsync();
      log(crayon.gray("Using mainModulePath of", mainModulePath, "and an entry point of", entryPoint));

      var ngrokSubdomain = argv['ngrok-subdomain'] || (config.ngrok && config.ngrok.subdomain) || undefined;
      var ngrokAuthToken = argv['ngrok-auth-token'] || (config.ngrok && config.ngrok.authToken) || undefined;

      var port = argv.port || await freeportAsync(9000);
      await serveAsync({port});

      return config.expInfoFile.readAsync();
    },
  },
  stop: {
    name: 'stop',
    description: "Stops the server",
    runAsync: async function (env) {
      await pm2.promise.connect();
      try {
        log("Stopping the server...");
        await pm2.promise.stop(await pm2NameAsync());
      } catch (e) {
        log.error("Failed to stop the server\n" + e.message);
      }
      await pm2.promise.disconnect();
      await config.expInfoFile.updateAsync({state: 'STOPPED'});
      log("Stopped.");
    },
  },
  pm2NameAsync,
  setupServeAsync,
};
