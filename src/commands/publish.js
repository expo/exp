var simpleSpinner = require('@exponent/simple-spinner');

var api = require('../api');
var CommandError = require('./CommandError');
var config = require('../config');
var log = require('../log');
var urlUtil = require('../urlUtil');
var userSettings = require('../userSettings');

async function uploadInfoAsync(env) {
  var us = await userSettings.readAsync();
  var {username, hashedPassword} = us;
  if ((!username) || (!hashedPassword)) {
    throw CommandError('NOT_LOGGED_IN', env, "You aren't logged in to Exponent. Try running `exp adduser` or `exp login` before you publish.");
  }

  var pkg = await config.packageJsonFile.readAsync();
  var packageName = pkg.name;
  if (!packageName) {
    throw CommandError('MISSING_PACKAGE_NAME', env, "Your package.json must contain a package name to publish");
  }

  // Rules for remote package name:
  // 1. If the name is of the format `@username/package-name` then the remote package name is `@username/package-name`
  // 2. If the name is just `package-name` then we conctruct `@username/package-name` from your logged in username
  //    and the package name in package.json.


  var remoteFullPackageName;
  var remotePackageName;
  var remoteUsername;
  var match = packageName.match(/^\@([a-zA-Z0-9_-]+)\/([a-zA-Z0-0_-]*)/);

  if (match) {
    remoteUsername = match[1];
    remotePackageName = match[2];
  } else {
    remoteUsername = username;
    remotePackageName = packageName;
  }

  remoteFullPackageName = '@' + remoteUsername + '/' + remotePackageName;

  var packageVersion = pkg.version;
  var localPackageName = packageName;

  var ngrokUrl = await urlUtil.mainBundleUrlAsync({
    type: 'ngrok',
    minify: true,
    dev: false,
  });

  return {
    username,
    hashedPassword,
    localPackageName,
    packageVersion,
    remoteUsername,
    remotePackageName,
    remoteFullPackageName,
    ngrokUrl,
  };

}

module.exports = {
  name: 'publish',
  description: "Publishes this article to exp.host",
  uploadInfoAsync,
  runAsync: async function (env) {

    let argv = env.argv;
    let args = argv._;
    let stealth = argv.stealth;
    let opts = {
      stealth,
    };

    let uploadInfo = await uploadInfoAsync(env);

    let infoWithOpts = Object.assign({}, uploadInfo, opts);

    log("Publishing package version", uploadInfo.packageVersion, "as", uploadInfo.remoteFullPackageName, "...");
    try {
      simpleSpinner.start();
      var result = await api.callMethodAsync('publish', [infoWithOpts]);
    } catch (e) {
      throw CommandError('PUBLISH_FAILED', env, e.message);
    } finally {
      simpleSpinner.stop();
    }

    log("Published.");

    console.log("exp://exp.host/" + result.packageFullName);

  },
};
