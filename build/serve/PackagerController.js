'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _ = require('lodash-node');
var child_process = require('child_process');
var freeportAsync = require('freeport-async');

var config = require('../config');

var PackagerController = (function () {
  function PackagerController(opts) {
    var _this = this;

    _classCallCheck(this, PackagerController);

    var DEFAULT_OPTS = {
      port: undefined
    };
    this.opts = _.assign(DEFAULT_OPTS, opts);
    this._givenOpts = opts;

    this.packagerReady = new _Promise(function (fulfill, reject) {
      _this._packagerReadyFulfill = fulfill;
      _this._packagerReadyReject = reject;
    });
  }

  _createClass(PackagerController, [{
    key: 'start',
    value: function start() {
      throw new Error("Use `.startAsync()` instead of `.start()`");
    }
  }, {
    key: 'startAsync',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var root = config.absolutePath;
      if (!this.opts.port) {
        // Consider warning or erroring here; we might want to force this interface
        // to always have the port explicitly specified to avoid confusion with the
        // code in serveAsync.js that also determines a free port
        this.opts.port = yield freeportAsync(19000);
      }
      this._packager = child_process.spawn(config.packagerPath, ["--port=" + this.opts.port, "--root=" + root, "--assetRoots=" + root], {
        stdio: [process.stdin, 'pipe', process.stderr],
        detached: false
      });

      this._packager.stdout.on('readable', function () {
        var chunk;
        var buffer = '';
        while (null !== (chunk = _this2._packager.stdout.read())) {
          buffer += chunk.toString();
          process.stdout.write(chunk);
          if (buffer.match(/React packager ready\./)) {
            _this2._packager.stdout.pipe(process.stdout);
            _this2._packagerReadyFulfill(_this2._packager);
            break;
          }
        }
      });

      return this.packagerReady;
    })
  }, {
    key: 'stop',
    value: function stop() {
      throw new Error("Use `.stopAsync()` instead of `.stop()`");
    }
  }, {
    key: 'stopAsync',
    value: function stopAsync() {
      var _this3 = this;

      return new _Promise(function (fulfill, reject) {
        if (_this3._packager) {
          // TODO: Figure out how to close whatever needs to be closed
          // to make the process exit if this child process is the only
          // thing holding it up
          //console.log("Stopping packager");
          _this3._packager.once('exit', fulfill);
          _this3._packager.kill();
        } else {
          reject(new Error("Packager hasn't been started"));
        }
      });
    }
  }]);

  return PackagerController;
})();

module.exports = PackagerController;
//# sourceMappingURL=../sourcemaps/serve/PackagerController.js.map