var crayon = require('@ccheever/crayon');
var pm2 = require('pm2');

var CommandError = require('../CommandError');
var config = require('../config');
var log = require('../log');
var pm2serve = require('./pm2serve');

module.exports = {
  name: 'logs',
  description: "Streams the exp-serve logs to a terminal window",
  args: ['[path-to-project]'],
  options: [
    ['--lines', "Number of lines of history to go back", 200],
    ['--raw', "View raw logs (with no prefixing)"],
  ],
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var projectDir = args[1] || process.cwd();

    await pm2serve.setupServeAsync(env);
    var pm2Id = await config.projectExpJsonFile(projectDir).getAsync('pm2Id', null);
    if (pm2Id == null) {
      throw CommandError('NO_PM2_ID', env, "I can't find a server; try running `exp start` first.");
    }

    var lines = argv.lines || 50;

    log("Use Ctrl-C to stop streaming logs");

    await pm2.promise.connect();
    pm2.streamLogs(pm2Id, lines, !!argv.raw);
  },
};
