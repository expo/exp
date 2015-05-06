#!/usr/bin/env node

var hasYield = require('has-yield');
if (!hasYield) {
  var log = require('./log');
  log.error("`yield` keyword not available; use iojs (or a version of node that supports yield and generators)");
  console.error("You are currently using node " + process.version);
  console.error("We recommend using nvm to install the latest version of iojs");
  console.error("");
  console.error(log.crayon.bold("https://github.com/creationix/nvm"));
  console.error("");
  console.error(" curl https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash");
  console.error(" nvm install iojs");
  console.error(" nvm alias default iojs");
  console.error("");
  console.error(" # ... then open a new terminal window and try again");
  console.error("");
  process.exit(1);
}

var child_process = require('child_process');
var co = require('co');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var minimist = require('minimist');
var ngrok = require('ngrok');
var path = require('path');
var request = require('request');

var commands = require('./commands/commands');
var config = require('./config');
var log = require('./log');
var urlUtil = require('./urlUtil');

module.exports = function(command, argv) {

  if (commands[command]) {
    commands[command].runAsync({argv}).then(function (result) {
      if (result != null) {
        console.error("\n");
        log(crayon.gray("\n") + crayon.gray(result));
      }
    }, function (err) {
      log.error(err);
    });
  } else {
    var commandKeys = Object.keys(commands);
    console.error(
      "Usage: exp <command>\n" +
      "\n" +
      "where <command> is one of:\n" +
      "    " + commandKeys.join(', ') + "\n" +
      "\n" +
      "exp help <cmd>     search for help on <cmd>\n");

    for (var i = 0; i < commandKeys.length; i++) {
      var key = commandKeys[i];
      var command = commands[key];
      console.error("exp " + command.name + "\t" + command.description);
    }
  }
};

if (require.main === module) {
  var argv = minimist(process.argv.slice(2));
  module.exports(argv._[0], argv);
}
