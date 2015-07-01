var _ = require('lodash-node');
var co = require('co');
var crayon = require('@ccheever/crayon');
var fs = require('fs');
var instapromise = require('instapromise');
var needle = require('needle');
var simpleSpinner = require('@exponent/simple-spinner');

var CommandError = require('./CommandError');
var log = require('../log');
var urlUtil = require('../urlUtil');
var urlOpts = require('./urlOpts');

module.exports = {
  name: 'bundle',
  description: "Saves the current bundle of your app to the terminal or a file",
  options: [
    ['--dev', "Whether to set the dev flag"],
    ['--minify', "Whether to minify the bundle"],
    ['--mainModulePath', "Path to the main module"],
    ...(urlOpts.options('localhost')),
  ],
  help: '',
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;

    var uo = urlOpts.optsFromEnv(env, {type: 'localhost', dev: true});

    var filepath = args[1];
    var outStream = process.stdout;
    if (filepath) {
      outStream = fs.createWriteStream(filepath);
    }

    var url = await urlUtil.mainBundleUrlAsync(uo);
    log("Requesting bundle from", url, "...");
    if (filepath) {
      log("Saving to", filepath);
    }

    try {

      simpleSpinner.start();
      try {
        var response = await needle.promise.get(url);
      } catch (e) {
        throw CommandError('NO_RESPONSE', env, "Server didn't respond.\n" + e.message);
      } finally {
        simpleSpinner.stop();
      }

      if (response.statusCode != 200) {
        if (_.isObject(response.body)) {
          var errInfo = response.body;
          log.error(errInfo.type, errInfo.message);
          console.error(errInfo.snippet);
          if (errInfo.type) {
            throw CommandError(errInfo.type, env, "Error in generating bundle");
          }
        } else {
          log.error("Uknown Error:", response.body);
        }
        throw CommandError('BAD_RESPONSE', env, "Non-200 response: " + response.statusCode + ": " + response.statusMessage);
      }
    } catch (e) {
      if (e._isCommandError) {
        throw e;
      } else {
        throw CommandError('FAILED_TO_DOWNLOAD_BUNDLE', env, "Failed to download bundle; did you run `exp start`?\n" + e);
      }
    }

    await outStream.promise.write(response.body);
    var bytes = response.body.length;
    if (filepath) {
      outStream.close();
    }

    var result = {
      err: null,
      url,
      bytes,
    };

    if (filepath) {
      result.savedTo = filepath;
    }

    return result;

  },
};
