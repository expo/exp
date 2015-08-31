'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var listSimulatorsAsync = _asyncToGenerator(function* () {
  try {
    var output = yield child_process.promise.exec('xcrun simctl list devices');
  } catch (e) {
    throw SimulatorNotAvailable(e);
  }

  var lines = output.split("\n");
  var devices = [];

  var runtime;
  for (var line of lines) {
    var m = line.match(/^-- ([^-]+) --$/);
    if (m) {
      runtime = m[1];
      if (runtime.match(/^Unavailable: /)) {
        runtime = undefined;
      }
    }
    if (runtime) {
      var m = line.match(/^[\s]*([^\(]+) \(([0-9A-F-]+)\).*/);
      var unavailable = line.match(/unavailable/);
      if (m && !unavailable) {
        devices.push({
          device: m[1],
          udid: m[2],
          runtime: runtime
        });
      }
    }
  }

  return devices;
});

var listSimulatorsAndTemplatesAsync = _asyncToGenerator(function* () {
  try {
    var output = yield child_process.promise.exec('xcrun instruments -s');
  } catch (e) {
    throw SimulatorNotAvailable(e);
  }
  var lines = output.split("\n");
  var result = {
    devices: [],
    templates: []
  };
  var bucket;
  for (var line of lines) {
    if (line === 'Known Devices:') {
      bucket = 'devices';
    } else if (line === 'Known Templates:') {
      bucket = 'templates';
    } else {
      if (line) {
        if (bucket) {
          if (bucket === 'devices') {
            var m = line.match(/^([^\[]*) \[([0-9A-F-]+)\]$/);
            if (m) {
              result[bucket].push({
                device: m[1],
                udid: m[2]
              });
            } else {
              throw SimulatorError('CANT_INTERPRET_OUTPUT', "Couldn't understand device: " + line);
            }
          } else {
            result[bucket].push(line);
          }
        } else {
          var err = SimulatorError('CANT_INTERPRET_OUTPUT', "Couldn't interpret the output from `xcrun instruments -s`");
          err.output = output;
          throw err;
        }
      }
    }
  }
  return result;
});

var startSimulatorAsync = _asyncToGenerator(function* (udid) {
  try {
    var output = yield child_process.promise.exec('xcrun instruments -w ' + JSON.stringify(udid));
  } catch (e) {
    if (e.code === 255) {
      return true;
    } else {
      throw SimulatorError('FAILED_TO_START_SIMULATOR', "Failed to start iOS Simulator: " + e.message);
    }
  }
});

var askUserToPickASimulatorAsync = _asyncToGenerator(function* () {
  var devices = yield listSimulatorsAsync();
  var choices = [];
  for (var device of devices) {
    choices.push({
      name: device.device + ' (' + device.runtime + ')',
      value: device.udid
    });
  }

  choices = _(_.sortBy(choices, 'name')).reverse().valueOf();

  var answers = yield inquirerAsync.promptAsync([{
    type: 'list',
    message: "Choose an available device to use",
    name: 'udid',
    choices: choices
  }]);

  return answers.udid;
});

var installExponentOnSimulatorAsync = _asyncToGenerator(function* () {
  return child_process.promise.exec('xcrun simctl install booted ' + JSON.stringify(exponentAppPath()));
});

var openUrlOnSimulatorAsync = _asyncToGenerator(function* (url) {
  return child_process.promise.exec('xcrun simctl openurl booted ' + JSON.stringify(url));
});

var chooseAndStartSimulatorAsync = _asyncToGenerator(function* () {
  var udid = yield askUserToPickASimulatorAsync();
  return yield startSimulatorAsync(udid);
});

var openUrlInUserChosenSimulatorAsync = _asyncToGenerator(function* (url) {
  var udid = yield askUserToPickASimulatorAsync();
  yield startSimulatorAsync(udid);
  // TODO: We don't need to install the app every time we open
  // a URL; only when there is a new version of it, (or the app
  // hasn't previously been installed)
  yield installExponentOnSimulatorAsync(exponentAppPath());
  try {
    yield openUrlOnSimulatorAsync(url);
  } catch (e) {
    if (e.code === 5) {
      // This is OK I think
      log.warn("Might not have been able to open URL on simulator");
    } else {
      throw SimulatorError('FAILED_TO_OPEN_URL', "Couldn't open URL on simulator: " + url + "\n" + e.message);
    }
  }
  return url;
});

var _ = require('lodash-node');
var child_process = require('child_process');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');
var path = require('path');

var log = require('./log');

function SimulatorError(code, message) {
  var err = new Error(message);
  err.code = code;
  err._isSimulatorError = true;
  return err;
}

function SimulatorNotAvailable(e) {
  return SimulatorError('SIMULATOR_NOT_AVAILABLE', "Simulator not available: " + e.message);
}

function exponentAppPath() {
  return path.join(__dirname, '..', 'Exponent.app');
}

module.exports = {
  listSimulatorsAndTemplatesAsync: listSimulatorsAndTemplatesAsync,
  startSimulatorAsync: startSimulatorAsync,
  askUserToPickASimulatorAsync: askUserToPickASimulatorAsync,
  listSimulatorsAsync: listSimulatorsAsync,
  installExponentOnSimulatorAsync: installExponentOnSimulatorAsync,
  openUrlOnSimulatorAsync: openUrlOnSimulatorAsync,
  openUrlInUserChosenSimulatorAsync: openUrlInUserChosenSimulatorAsync,
  chooseAndStartSimulatorAsync: chooseAndStartSimulatorAsync
};

if (require.main === module) {
  if (process.argv[2]) {
    openUrlInUserChosenSimulatorAsync(process.argv[2]).then(console.log, console.error);
  } else {
    chooseAndStartSimulatorAsync().then(console.log, console.error);
  }
  //askUserToPickASimulatorAsync().then(startSimulatorAsync, console.error).then(console.log, console.error);
}
//# sourceMappingURL=sourcemaps/simulator.js.map