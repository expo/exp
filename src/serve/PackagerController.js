var _ = require('lodash-node');
var child_process = require('child_process');
var freeportAsync = require('freeport-async');

var config = require('../config');

class PackagerController {

  constructor(opts) {

    var DEFAULT_OPTS = {
      port: undefined,
    };
    this.opts = _.assign(DEFAULT_OPTS, opts);
    this._givenOpts = opts;

    this.packagerReady = new Promise((fulfill, reject) => {
      this._packagerReadyFulfill = fulfill;
      this._packagerReadyReject = reject;
    });
  }

  start() {
    return this.startAsync();
  }

  async startAsync() {

    var root = config.absolutePath;
    if (!this.opts.port) {
      // Consider warning or erroring here; we might want to force this interface
      // to always have the port explicitly specified to avoid confusion with the
      // code in serveAsync.js that also determines a free port
      this.opts.port = await freeportAsync(19000);
    }
    this._packager = child_process.spawn(config.packagerPath, ["--port=" + this.opts.port, "--root=" + root, "--assetRoots=" + root,], {
      stdio: [process.stdin, 'pipe', process.stderr],
    });

    this._packager.stdout.on('readable', () => {
      var chunk;
      var buffer = '';
      while (null !== (chunk = this._packager.stdout.read())) {
        buffer += chunk.toString();
        process.stdout.write(chunk);
        if (buffer.match(/React packager ready\./)) {
          this._packager.stdout.pipe(process.stdout);
          this._packagerReadyFulfill(this._packager);
          break;
        }
      }
    });

    return this.packagerReady;

  }

  stop() {
    return this.stopAsync();
  }

  stopAsync() {
    return new Promise((fulfill, reject) => {
      if (this._packager) {
        // TODO: Figure out how to close whatever needs to be closed
        // to make the process exit if this child process is the only
        // thing holding it up
        this._packager.once('exit', fulfill);
        this._packager.kill();
      } else {
        reject(new Error("Packager hasn't been started"));
      }
    });
  }

}

module.exports = PackagerController;
