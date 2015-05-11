'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var writeFileAsync = _asyncToGenerator(function* (data) {
  yield mkdirp.promise(dotExponentDirectory());
  return jsonFile.writeAsync(userSettingsFile(), data);
});

var readFileAsync = _asyncToGenerator(function* () {
  return jsonFile.readAsync(userSettingsFile(), { cantReadFileDefault: {} });
});

var mergeFileAsync = _asyncToGenerator(function* (data) {
  return jsonFile.mergeAsync(userSettingsFile(), data);
});

var _ = require('lodash-node');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
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

module.exports = {
  mergeFileAsync: mergeFileAsync,
  readFileAsync: readFileAsync,
  userSettingsFile: userSettingsFile,
  writeFileAsync: writeFileAsync };
//# sourceMappingURL=sourcemaps/userSettings.js.map