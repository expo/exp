import {
  Login,
} from 'xdl';

var log = require('../log');

module.exports = {
  name: 'login',
  description: "Login to exp.host",
  help: "",
  runAsync: async function (env) {
    let result = await Login.logoutAsync();
    if (result) {
      log("Success.");
      return result;
    } else {
      throw new Error("Unexpected Error: Couldn't logout");
    }
  },
};
