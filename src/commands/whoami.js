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
  runAsync: async function (env) {
    try {
      var settingsData = await userSettings.readAsync();
      if (!settingsData || !settingsData.username || !settingsData.hashedPassword) {
        throw NotLoggedIn("You're not logged in");
      }

      var {username, hashedPassword} = settingsData;

      var result = await api.callMethodAsync('whoami', {username, hashedPassword});

      if (result.user) {
        log("Logged in as", result.user.username);
        console.log(result.user);
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

  },
};
