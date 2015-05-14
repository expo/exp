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

module.exports = function(command, argv) {
  var script = scriptName() || 'exp';

  if (command == 'help') {
    command = argv._[0];
    argv._ = argv._.slice(1);
    argv.help = true;
  }

  if (!command) {
    return help.runAsync({argv});
  }

  var cmd = commands[command];
  if (!cmd && command !== 'help') {
    log.error("Unknown command: " + command);
    return help.runAsync({argv:{_:[]}});
  }

  var run;
  if (argv.help || argv.h) {
    run = help.runAsync({argv, command, script});
  } else {
    run = cmd.runAsync({argv});
  }

  return run;

};
