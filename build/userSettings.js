'use strict';

var _ = require('lodash-node');
var co = require('co');
var fs = require('fs');
var instapromise = require('instapromise');
var mkdirp = require('mkdirp');
var path = require('path');

// TODO: Make this more configurable
function userSettingsFile() {
  return path.join(dotExponentDirectory(), 'exponent.json');
}

function dotExponentDirectory() {
  if (!process.env.HOME) {
    throw new Error('Can\'t determine your home directory; make sure your $HOME environment variable is set.');
  }
  return path.join(process.env.HOME, '.exponent');
}

var writeFileAsync = co.wrap(function* (data) {
  yield mkdirp.promise(dotExponentDirectory());
  yield fs.promise.writeFile(userSettingsFile(), JSON.stringify(data, null, 2), 'utf8');
  return data;
});

var readFileAsync = co.wrap(function* () {
  try {
    var json = yield fs.promise.readFile(userSettingsFile(), 'utf8');
  } catch (e) {
    // File not found or not readable
    return {};
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error('Invalid JSON in settings file ' + userSettingsFile() + ':' + e);
  }
});

var mergeAsync = co.wrap(function* (data) {
  // TODO: Make this atomic/transactional (but its probably OK to not worry about this for now)
  var oldData = yield readFileAsync();
  var newData = _.assign(oldData, data); // N.B.: oldData actually gets mutated here
  return yield writeFileAsync(newData);
});

module.exports = {
  mergeAsync: mergeAsync,
  readFileAsync: readFileAsync,
  userSettingsFile: userSettingsFile,
  writeFileAsync: writeFileAsync };
//# sourceMappingURL=sourcemaps/userSettings.js.map