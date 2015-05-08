'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var child_process = require('child_process');

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var child = child_process.spawn.apply(child_process, args);
  var p = new _Promise(function (fulfill, reject) {
    child.on('close', function (code) {
      if (code) {
        reject(new Error('Process exited with non-zero code: ' + code));
      } else {
        fulfill(0);
      }
    });
  });
  p.child = child;
  return p;
};
//# sourceMappingURL=sourcemaps/spawnAsync.js.map