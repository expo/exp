var child_process = require('child_process');
var path = require('path');

module.exports = {
  name: 'status',
  description: "Shows the status of all the Exponent packager/server processes started",
  help: "This just runs `pm2 list`",
  runAsync: async function (env) {

    var pm2 = path.resolve(path.join(require.resolve('pm2'), '..', 'bin', 'pm2'));
    var list = child_process.spawn(pm2, ['list'], {stdio: 'inherit'});

  },
};
