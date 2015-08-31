'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var crayon = require('@ccheever/crayon');

var CommandError = require('./CommandError');
var commands = require('./commands');
var help = require('./help');
var log = require('../log');

function scriptName() {
  try {
    return process.argv[1].match(/^.*\/([^\/]+)\.js$/)[1];
  } catch (e) {
    return;
  }
}

module.exports = function (command, argv) {
  var script = scriptName() || 'exp';

  if (command == 'help') {
    command = argv._[0];
    argv._ = argv._.slice(1);
    argv.help = true;
  }

  if (!command) {
    return help.runAsync({ argv: argv });
  }

  var cmd;
  try {
    cmd = commands[command]();
  } catch (e) {
    cmd = undefined;
  }
  if (!cmd && command !== 'help') {
    var env = { argv: { _: [] } };
    help.runAsync(env);
    return _Promise.reject(CommandError('UNKNOWN_COMMAND', env, "No such command: " + command));
  }

  var run;
  if (argv.help || argv.h) {
    run = help.runAsync({ argv: argv, command: command, script: script });
  } else {
    run = cmd.runAsync({ argv: argv });
  }

  return run;
};
//# sourceMappingURL=../sourcemaps/commands/runAsync.js.map