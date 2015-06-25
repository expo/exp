var _ = require('lodash-node');

var api = require('../api');
var CommandError = require('./CommandError');
var log = require('../log');
var userSettings = require('../userSettings');

module.exports = {
  name: 'login',
  description: "Login to exp.host",
  help: "",
  runAsync: async function (env) {

    var argv = env.argv;
    var args = argv._;
    var err = null;

    var result = await api.callMethodAsync('logout', env.argv);
    return true;
  },
};
