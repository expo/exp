var crayon = require('@ccheever/crayon');
var delayAsync = require('delay-async');
var freeportAsync = require('freeport-async');
var instapromise = require('instapromise');
var network = require('@exponent/network');
var ngrok = require('ngrok');

var config = require('../config');
var PackagerController = require('./PackagerController');
var urlUtil = require('../urlUtil');

function _randomPortRangeStart() {
  return 19000 + Math.floor(Math.random() * 1000);
}

module.exports = async function (opts) {

  var expSettings = await config.expInfoFile.readAsync();
  opts = opts || {};
  var port = opts.port || expSettings.port || await freeportAsync(_randomPortRangeStart());

  var pc = new PackagerController({port});
  pc.start();
  var ngrokUrl$ = ngrok.promise.connect({port});

  var [_ready, ngrokBaseUrl, lanIp, entryPoint, mainModulePath] = await Promise.all([
    pc.packagerReady,
    ngrokUrl$,
    network.privateIpAsync(),
    urlUtil.entryPointAsync(),
    urlUtil.guessMainModulePathAsync(),
    ]);
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
    });

  var [_data, _true] = await Promise.all([writeInfoFile$, urlUtil.testUrlAsync(localhostUrl)]);

  return _data;
}

if (require.main === module) {
  module.exports().then(crayon.cyan.log, crayon.red.log);
}
