'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var delayAsync = require('delay-async');

module.exports = _asyncToGenerator(function* (expFile) {

  var state = yield expFile.getAsync('state', null);
  if (state === 'RUNNING') {
    return true;
  } else {
    yield delayAsync(500);
    return module.exports(expFile);
  }
});
//# sourceMappingURL=../sourcemaps/serve/waitForRunningAsync.js.map