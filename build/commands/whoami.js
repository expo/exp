'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var api = require('../api');
var CommandError = require('./CommandError');
var log = require('../log');
var userSettings = require('../userSettings');

module.exports = {
  name: 'whoami',
  description: 'Checks with the server and then says who you are logged in as',
  runAsync: _asyncToGenerator(function* (env) {
    var settingsData = yield userSettings.readAsync();
    if (!settingsData) {
      throw CommandError('NO_SETTINGS_DATA', env, 'You aren\'t logged in.');
    }

    var username = settingsData.username;
    var hashedPassword = settingsData.hashedPassword;

    var result = yield api.callMethodAsync('adduser', { username: username, hashedPassword: hashedPassword });

    if (result.user) {
      log('Logged in as', result.user.username);
      console.log(result.user);
      return result.user;
    } else {
      throw CommandError('NO_USER', env, 'No such user or your password is wrong.');
    }
  }) };
//# sourceMappingURL=../sourcemaps/commands/whoami.js.map