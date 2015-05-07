"use strict";

var _Promise = require("babel-runtime/core-js/promise")["default"];

module.exports = function (ms) {
  return new _Promise(function (fulfill, reject) {
    setTimeout(fulfill, ms);
  });
};
//# sourceMappingURL=sourcemaps/waitAsync.js.map