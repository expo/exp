#!/usr/bin/env node
'use strict';

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

module.exports = function (command, argv) {

  if (commands[command]) {
    commands[command].runAsync({ argv: argv }).then(function (result) {
      if (result != null) {
        console.error('\n');
        log(log.crayon.gray(result));
      }
    }, function (err) {
      crayon.red.bold.error('Error:');
      crayon.red.error(err);
    });
  } else {
    console.error('Usage: exp <command>\n' + '\n' + 'where <command> is one of:\n' + '    serve, send, snapshot, help\n' + '\n' + 'exp help <cmd>     search for help on <cmd>\n');
  }
};

if (require.main === module) {
  var argv = minimist(process.argv.slice(2));
  module.exports(argv._[0], argv);
}
//# sourceMappingURL=sourcemaps/exp.js.map