'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var crayon = require('@ccheever/crayon');

var api = require('../api');
var CommandError = require('./CommandError');
var log = require('../log');
var userSettings = require('../userSettings');

function NotLoggedIn(message) {
  var err = new Error(message);
  err._isNotLoggedIn = true;
  return err;
}

module.exports = {
  name: 'whoami',
  description: "Checks with the server and then says who you are logged in as",
  runAsync: _asyncToGenerator(function* (env) {
    try {
      var settingsData = yield userSettings.readAsync();
      if (!settingsData || !settingsData.username || !settingsData.hashedPassword) {
        throw NotLoggedIn("You're not logged in");
      }

      var username = settingsData.username;
      var hashedPassword = settingsData.hashedPassword;

      var result = yield api.callMethodAsync('whoami', { username: username, hashedPassword: hashedPassword });

      if (result.user) {
        log("Logged in as", result.user.username);
        for (var key of _Object$keys(result.user)) {
          console.log(key + ':', result.user[key]);
        }
        return result.user;
      } else {
        throw NotLoggedIn("No such user or your password is wrong.");
      }
    } catch (e) {
      if (e._isNotLoggedIn) {
        console.error(e.message);
        return null;
      } else {
        throw e;
      }
    }
  })
};
//# sourceMappingURL=../sourcemaps/commands/whoami.js.map