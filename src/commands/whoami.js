import {
  Login,
} from 'xdl';

var log = require('../log');

module.exports = (program) => {
  program
    .command('whoami')
    .description('Checks with the server and then says who you are logged in as')
    .action(async function (env, options) {
      let result = await Login.whoamiAsync();
      if (result && result.user && result.user.username) {
        log(`Logged in as ${result.user.username}`);
        return result;
      } else {
        throw new Error("Unexpected Error: Couldn't get user information");
      }
    });
};
