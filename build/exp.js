#!/usr/bin/env node
'use strict';

var crayon = require('@ccheever/crayon');

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
var instapromise = require('instapromise');

var argv = require('./argv');
var config = require('./config');
var log = require('./log');
var update = require('./update');

module.exports = require('./commands/runAsync');

if (require.main === module) {

  var checkForUpdate$ = update.checkForExpUpdateAsync();

  module.exports(argv._[0], argv).then(function (result) {
    if (result != null) {
      if (argv.debug) {
        console.error("\n");
        log(crayon.gray("\n") + crayon.gray(result));
      }
    }
  }, function (err) {
    if (err._isCommandError) {
      if (false) {
        //if (err.code) {
        log.error(crayon.orange.bold(err.code) + ' ' + crayon.red(err.message));
      } else {
        log.error(err.message);
      }
    } else if (err._isApiError) {
      //log.error(crayon.orange.bold('API Error') + ' ' + crayon.red(err.message));
      log.error(crayon.red(err.message));
    } else {
      log.error(err.message);
      crayon.gray.error(err.stack);
    }
  })['catch'](function (err) {
    log.error(err);
  }).then(function () {
    checkForUpdate$.then(function (result) {
      // console.log("result.state=", result.state);
      switch (result.state) {
        case 'up-to-date':
          //crayon.gray.error(result.message);
          break;
        case 'out-of-date':
          crayon.green.error(result.message);
          break;
        case 'ahead-of-published':
          crayon.cyan.error(result.message);
          break;
        case 'deprecated':
          crayon.yellow.bold.error(result.message);
          break;
        default:
          log.error("Confused about what version of exp you have?");
      }
    });
  });
}
//# sourceMappingURL=sourcemaps/exp.js.map