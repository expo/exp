import {
  Login,
} from 'xdl';

var log = require('../log');

module.exports = {
  name: 'whoami',
  description: "Checks with the server and then says who you are logged in as",
  runAsync: async function (env) {
    let result = await Login.whoamiAsync();
    if (result && result.user && result.user.username) {
      log(`Logged in as ${result.user.username}`);
      return result;
    } else {
      throw new Error("Unexpected Error: Couldn't get user information");
    }
  },
};
