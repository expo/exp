#!/usr/bin/env node

var crayon = require('@ccheever/crayon');

var child_process = require('child_process');
var glob = require('glob');
var instapromise = require('instapromise');
var path = require('path');
// Grab the version from package.json and put it in `module.exports.version`
require('pkginfo')(module, 'version');

var log = require('./log');
var update = require('./update');

async function runAsync() {
  try {
    var program = require('commander');
    program.version(module.exports.version);
    //glob.sync('./commands/**/*.js').forEach(file => {
    //  require(path.resolve(file))(program);
    //});

    require('./commands/whoami')(program);

    program.parse(process.argv);
  } catch (err) {
    if (err._isCommandError) {
      if (false) {
        log.error(crayon.orange.bold(err.code) + ' ' + crayon.red(err.message));
      } else {
        log.error(err.message);
      }
    } else if (err._isApiError) {
      log.error(crayon.red(err.message));
    } else {
      log.error(err.message);
      crayon.gray.error(err.stack);
    }
  }
}

async function checkForUpdateAsync() {
  let checkForUpdate = await update.checkForExpUpdateAsync();
  switch (checkForUpdate.state) {
    case 'up-to-date':
      break;
    case 'out-of-date':
      crayon.green.error(checkForUpdate.message);
      break;
    case 'ahead-of-published':
      crayon.cyan.error(checkForUpdate.message);
      break;
    case 'deprecated':
      crayon.yellow.bold.error(checkForUpdate.message);
      break;
    default:
      log.error("Confused about what version of exp you have?");
  }
}

if (require.main === module) {
  Promise.all([
    runAsync(),
    checkForUpdateAsync(),
  ]);
}
