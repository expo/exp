var crayon = require('@ccheever/crayon');
var freeportAsync = require('freeport-async');
var instapromise = require('instapromise');
var network = require('@exponent/network');
var ngrok = require('ngrok');

var config = require('../config');
var log = require('../log');
var PackagerController = require('./PackagerController');
var urlUtil = require('../urlUtil');

async function _serve(opts) {

  var expSettings = await config.expInfoFile.readAsync();
  opts = opts || {};
  var port = opts.port || expSettings.port || await freeportAsync(6080);

  var pc = new PackagerController({port});
  var pcStart$ = pc.startAsync();
  var ngrokUrl$ = ngrok.promise.connect({port});

  try {
    var [_ready, ngrokBaseUrl, lanIp, entryPoint, mainModulePath] = await Promise.all([
      pc.packagerReady,
      ngrokUrl$,
      network.privateIpAsync(),
      urlUtil.entryPointAsync(),
      urlUtil.guessMainModulePathAsync(),
      ]);
  } catch (e) {

    // Shutdown packager
    var packagerShutdown$ = new Promise(function (fulfill, reject) {
      log("Attempting to shut down packager (" + pc._packager.pid + ")...");
      pc._packager.on('exit', function (code) {
        log("packager shut down.");
        fulfill(code);
        //console.log("process._getActiveRequests()", process._getActiveRequests().length);
        //console.log("process._getActiveHandles()", process._getActiveHandles().length);
      });
      pc.stopAsync().catch(reject);
    });

    // Shutdown ngrok
    var ngrokShutdown$ = new Promise(function (fulfill, reject) {
      ngrokUrl$.then(function (ngrokBaseUrl) {
        log("Shutting down ngrok...");
        return ngrok.promise.disconnect(ngrokBaseUrl).then(function (x) {
          log("ngrok shutdown.");
          fulfill(x);
        }, function (err) {
          log.error("Disconnecting from ngrok failed", err);
        });
      }).catch(function (err) {
        log.error("Failed to shutdown ngrok", err.message);
        reject(err);
      });
    });

    // TODO: This is really hacky but does let the process terminate
    Promise.all([packagerShutdown$, ngrokShutdown$]).then(function () {
      for (var h of process._getActiveHandles()) {
        if (h.destroy) {
          h.destroy();
        }
      }
    }).catch(function (err) {
      log.error("Error while shutting down.");
    });

    throw e;
  }

  var lanBaseUrl = 'http://' + lanIp + ':' + port;
  var localhostBaseUrl = 'http://localhost:' + port;

  var urlOpts = {entryPoint, mainModulePath};
  var lanUrl = urlUtil.constructUrlFromBaseUrl(lanBaseUrl, urlOpts);
  var localhostUrl = urlUtil.constructUrlFromBaseUrl(localhostBaseUrl, urlOpts);
  var ngrokUrl = urlUtil.constructUrlFromBaseUrl(ngrokBaseUrl, urlOpts);

  var writeInfoFile$ = config.expInfoFile.mergeAsync({
    port,
    ngrokBaseUrl, lanBaseUrl, localhostBaseUrl,
    ngrokUrl, lanUrl, localhostUrl,
    err: null,
    state: 'RUNNING',
    });

  var [_data, _true, _pc] = await Promise.all([writeInfoFile$, urlUtil.testUrlAsync(localhostUrl)]);

  return _.assign(_data, {packageController: pc});

}

module.exports = function (opts) {
  return _serve(opts).catch(function (err) {
    config.expInfoFile.update('err', err.stack());
  });
};


if (require.main === module) {
  module.exports().then(crayon.cyan.log, (err) => {
    crayon.red.log(err);
    // Killing the child_process doesn't seem to work very well,
    // so this is the robust way to do it
  });
}
