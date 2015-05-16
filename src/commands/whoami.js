var api = require('../api');
var CommandError = require('./CommandError');
var log = require('../log');
var userSettings = require('../userSettings');

module.exports = {
  name: 'whoami',
  description: "Checks with the server and then says who you are logged in as",
  runAsync: async function (env) {
    var settingsData = await userSettings.readAsync();
    if (!settingsData) {
      throw CommandError('NO_SETTINGS_DATA', env, "You aren't logged in.");
    }

    var {username, hashedPassword} = settingsData;

    var result = await api.callMethodAsync('adduser', {username, hashedPassword});

    if (result.user) {
      log("Logged in as", result.user.username);
      console.log(result.user);
      return result.user;
    } else {
      throw CommandError('NO_USER', env, "No such user or your password is wrong.");
    }

  },
};
