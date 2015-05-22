'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var listSimulatorsAndTemplatesAsync = _asyncToGenerator(function* () {
  try {
    var output = yield child_process.promise.exec('xcrun instruments -s');
  } catch (e) {
    throw SimulatorNotAvailable(e);
  }
  var lines = output.split('\n');
  var result = {
    devices: [],
    templates: [] };
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
                udid: m[2] });
            } else {
              throw SimulatorError('CANT_INTERPRET_OUTPUT', 'Couldn\'t understand device: ' + line);
            }
          } else {
            result[bucket].push(line);
          }
        } else {
          var err = SimulatorError('CANT_INTERPRET_OUTPUT', 'Couldn\'t interpret the output from `xcrun instruments -s`');
          err.output = output;
          throw err;
        }
      }
    }
  }
  return result;
});

var startSimulatorAsync = _asyncToGenerator(function* (udid) {
  var output = yield child_process.promise.exec('open -a "iOS Simulator" --args -CurrentDeviceUDID ' + udid);
});

var askUserToPickASimulatorAsync = _asyncToGenerator(function* () {
  var _ref = yield listSimulatorsAndTemplatesAsync();

  var devices = _ref.devices;

  var choices = [];
  for (var device of devices) {
    choices.push({
      name: device.device,
      value: device.udid });
  }

  choices = _(_.sortBy(choices, function (choice) {
    return 0 + !!choice.name.match(/iPhone/);
  })).reverse().value();

  var answers = yield inquirerAsync.promptAsync([{
    type: 'list',
    message: 'Choose an available device to use',
    name: 'udid',
    choices: choices }]);

  return answers.udid;
});

var _ = require('lodash-node');
var child_process = require('child_process');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');

function SimulatorError(code, message) {
  var err = new Error(message);
  err.code = code;
  err._isSimulatorError = true;
  return err;
}

function SimulatorNotAvailable(e) {
  return SimulatorError('SIMULATOR_NOT_AVAILABLE', 'Simulator not available: ' + e.message);
}

module.exports = {
  listSimulatorsAndTemplatesAsync: listSimulatorsAndTemplatesAsync,
  startSimulatorAsync: startSimulatorAsync,
  askUserToPickASimulatorAsync: askUserToPickASimulatorAsync };

if (require.main === module) {
  askUserToPickASimulatorAsync().then(startSimulatorAsync, console.error);
}
//# sourceMappingURL=sourcemaps/simulator.js.map