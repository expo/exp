'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var pm2NameAsync = _asyncToGenerator(function* () {
  var packageName = yield jsonFile.getAsync('package.json', 'name');
  var pkgJsonHash = md5hex(packageJsonFullPath(), 6);
  return 'exp-serve/' + pkgJsonHash + '.' + packageName;
});

var crayon = require('@ccheever/crayon');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var md5hex = require('@exponent/md5hex');
var path = require('path');

var config = require('../config');
var log = require('../log');
var urlUtil = require('../urlUtil');

function packageJsonFullPath() {
  return path.resolve('package.json');
}

module.exports = {
  name: 'serve',
  description: 'Starts a local server to serve your app and gives you a URL to it',
  args: ['[project-dir]'],
  options: [['--path', 'The path to the place where your package is', '.'], ['--port', 'The port to run the server on', 'Random free port'], ['--ngrokSubdomain', 'The ngrok subdomain to use', config.ngrok && config.ngrok.subdomain], ['--ngrokAuthToken', 'The ngrok authToken to use', config.ngrok && config.ngrok.authToken], ['--send', 'An e-mail address or phone number to send a link to']],
  help: 'Starts a local server to serve your app and gives you a URL to it.\n' + '[project-dir] defaults to \'.\'\n' + '\n' + 'If you don\'t specify a port, a random, free port will be chosen automatically.',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;

    // If a project-dir is provided, change to that directory
    var projectDir = args[1];
    if (projectDir) {
      process.chdir(projectDir);
      log(crayon.gray('Using project at', process.cwd()));
    }

    var mainModulePath = yield urlUtil.guessMainModulePathAsync();
    var entryPoint = yield urlUtil.entryPointAsync();
    log(crayon.gray('Using mainModulePath of', mainModulePath, 'and an entry point of', entryPoint));

    var ngrokSubdomain = argv['ngrok-subdomain'] || config.ngrok && config.ngrok.subdomain || undefined;
    var ngrokAuthToken = argv['ngrok-auth-token'] || config.ngrok && config.ngrok.authToken || undefined;

    var port = argv.port;
    if (port == null) {
      port = 9000 + Math.floor(Math.random() * 1000);
    }

    var pm2name = 'exp-serve.<hash>.<pkg-name>';
  }),
  pm2NameAsync: pm2NameAsync };
//# sourceMappingURL=../sourcemaps/commands/pm2serve.js.map