'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var latestExpVersionAsync = _asyncToGenerator(function* () {
  var packageName = yield jsonFile(path.join(__dirname, '..', 'package.json')).getAsync('name');
  var version_ = yield child_process.promise.exec('npm view ' + packageName + ' version');
  return version_.trim();
});

var currentExpVersionAsync = _asyncToGenerator(function* () {
  return jsonFile(path.join(__dirname, '..', 'package.json')).getAsync('version');
});

var checkForExpUpdateAsync = _asyncToGenerator(function* () {
  var current$ = currentExpVersionAsync();
  var latest$ = latestExpVersionAsync();

  var _ref = yield _Promise.all([current$, latest$]);

  var _ref2 = _slicedToArray(_ref, 2);

  var current = _ref2[0];
  var latest = _ref2[1];

  var state;
  var message;
  switch (semver.compare(current, latest)) {
    case -1:
      state = 'out-of-date';
      message = "There is a new version of exp available (" + latest + ").\n" + "You are currently using exp " + current + "\n" + "Run `npm update -g exp` to get the latest version";
      break;

    case 0:
      state = 'up-to-date';
      message = "Your version of exp (" + current + ") is the latest version available.";
      break;

    case 1:
      state = 'ahead-of-published';
      message = "Your version of exp (" + current + ") is newer than the" + " latest version published to npm (" + latest + ").";
      break;

    default:
      throw new Error("Confused about whether exp is up-to-date or not");
  }

  state = 'deprecated';
  message = message + "\n" + crayon.red("exp is now deprecated. xde, the new GUI that replaces exp, is available at\nhttps://github.com/exponentjs/xde");

  return {
    state: state,
    message: message,
    current: current,
    latest: latest
  };
});

var child_process = require('child_process');
var crayon = require('@ccheever/crayon');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var path = require('path');
var semver = require('semver');

module.exports = {
  currentExpVersionAsync: currentExpVersionAsync,
  latestExpVersionAsync: latestExpVersionAsync,
  checkForExpUpdateAsync: checkForExpUpdateAsync
};
//# sourceMappingURL=sourcemaps/update.js.map