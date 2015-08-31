'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _ = require('lodash-node');

var api = require('../api');
var CommandError = require('./CommandError');
var log = require('../log');
var userSettings = require('../userSettings');

module.exports = {
  name: 'login',
  description: "Login to exp.host",
  help: "",
  runAsync: _asyncToGenerator(function* (env) {

    var argv = env.argv;
    var args = argv._;
    var err = null;

    var result = yield api.callMethodAsync('logout', env.argv);
    return true;
  })
};
//# sourceMappingURL=../sourcemaps/commands/logout.js.map