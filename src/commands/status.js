var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

import {
  ProjectSettings,
} from 'xdl';

var config = require('../config');
var log = require('../log');

module.exports = {
  name: 'status',
  description: "Shows the status of the Exponent packager/server process started",
  args: ["[project-dir]"],
  options: [
    ['--all', "Show status for all processes"],
  ],
  help: "This reads the status from the config file under .exponent/ or runs `pm2 list` when --all is used",
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var projectDir = args[1] || process.cwd();

    if (argv.all) {
      var pm2 = path.resolve(path.join(require.resolve('pm2'), '..', 'bin', 'pm2'));
      var list = child_process.spawn(pm2, ['list'], {stdio: 'inherit'});
    } else {
      if (ProjectSettings.dotExponentProjectDirectoryExists(projectDir)) {
        var state = await config.projectExpJsonFile(projectDir).getAsync('state', null);
        log(state);
      } else {
        log.error("No project found at " + projectDir);
      }
    }
  },
};
