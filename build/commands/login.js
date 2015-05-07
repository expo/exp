'use strict';

var _ = require('lodash-node');
var co = require('co');

var adduser = require('./adduser');

module.exports = {
  name: 'login',
  description: 'Login to exp.host',
  help: '',
  runAsync: co.wrap(function* (env) {
    var newEnv = _.clone(env);
    newEnv.isLogin = true;
    return yield adduser.runAsync(newEnv);
  }) };
//# sourceMappingURL=../sourcemaps/commands/login.js.map