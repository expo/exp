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
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var minimist = require('minimist');

var commands = require('./commands/commands');
var config = require('./config');
var log = require('./log');

module.exports = require('./commands/runAsync');

if (require.main === module) {
  var argv = minimist(process.argv.slice(2));
  module.exports(argv._[0], argv).then(function (result) {
    if (result != null) {
      console.error("\n");
      log(crayon.gray("\n") + crayon.gray(result));
    }
  }, function (err) {
    if (err._isCommandError) {
      log.error(err.message);
    } else {
      log.error(err.message);
      crayon.gray.error(err.stack);
    }
  }).catch((err) => {
    log.error(err);
  });
}
