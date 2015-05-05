var crayon = require('@ccheever/crayon');

function log() {
  var prefix = crayon.gray("[") + crayon.gray('exp') + crayon.gray("]");
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0));
  console.error.apply(console, args);
}

log.crayon = crayon;

module.exports = log;
