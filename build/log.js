'use strict';

var crayon = require('@ccheever/crayon');

function log() {
  var prefix = crayon.gray('[') + crayon.gray('exp') + crayon.gray(']');
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0));
  console.error.apply(console, args);
}

log.error = function error() {
  var prefix = crayon.red('[') + crayon.gray('exp') + crayon.red(']') + crayon.red.bold(' Error:');
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0).map(function (x) {
    return crayon.red(x);
  }));
  console.error.apply(console, args);
};

log.warn = function warn() {
  var prefix = crayon.yellow('[') + crayon.gray('exp') + crayon.yellow(']');
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0).map(function (x) {
    return crayon.yellow(x);
  }));
  console.warn.apply(console, args);
};

log.gray = function () {
  var prefix = '[exp]';
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0));
  crayon.gray.error.apply(crayon, args);
};

log.crayon = crayon;

module.exports = log;
//# sourceMappingURL=sourcemaps/log.js.map