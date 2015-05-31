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

async function listSimulatorsAsync() {
  try {
    var output = await child_process.promise.exec('xcrun simctl list devices');
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
          runtime,
        });
      }
    }
  }

  return devices;

}

async function listSimulatorsAndTemplatesAsync() {
  try {
    var output = await child_process.promise.exec('xcrun instruments -s');
  } catch (e) {
    throw SimulatorNotAvailable(e);
  }
  var lines = output.split("\n");
  var result = {
    devices: [],
    templates: [],
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
                udid: m[2],
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
}

async function startSimulatorAsync(udid) {
  try {
    var output = await child_process.promise.exec('xcrun instruments -w ' + JSON.stringify(udid));
  } catch (e) {
    if (e.code === 255) {
      return true;
    } else {
      throw SimulatorError('FAILED_TO_START_SIMULATOR', "Failed to start iOS Simulator: " + e.message);
    }
  }
}

async function askUserToPickASimulatorAsync() {
  var devices = await listSimulatorsAsync();
  var choices = [];
  for (var device of devices) {
    choices.push({
      name: device.device + ' (' + device.runtime + ')',
      value: device.udid,
    });
  }

  choices = _(_.sortBy(choices, 'name')).reverse().valueOf();

  var answers = await inquirerAsync.promptAsync([{
    type: 'list',
    message: "Choose an available device to use",
    name: 'udid',
    choices: choices,
  }]);

  return answers.udid;

}

function exponentAppPath() {
  return path.join(__dirname, '..', 'Exponent.app');
}

async function installExponentOnSimulatorAsync() {
  return child_process.promise.exec('xcrun simctl install booted ' + JSON.stringify(exponentAppPath()));
}

async function openUrlOnSimulatorAsync(url) {
  return child_process.promise.exec('xcrun simctl openurl booted ' + JSON.stringify(url));
}

async function chooseAndStartSimulatorAsync() {
  var udid = await askUserToPickASimulatorAsync();
  return await startSimulatorAsync(udid);
}

async function openUrlInUserChosenSimulatorAsync(url) {
  var udid = await askUserToPickASimulatorAsync();
  await startSimulatorAsync(udid);
  // TODO: We don't need to install the app every time we open
  // a URL; only when there is a new version of it, (or the app
  // hasn't previously been installed)
  await installExponentOnSimulatorAsync(exponentAppPath());
  try {
    await openUrlOnSimulatorAsync(url);
  } catch (e) {
    if (e.code === 5) {
      // This is OK I think
      log.warn("Might not have been able to open URL on simulator");
    } else {
      throw SimulatorError('FAILED_TO_OPEN_URL', "Couldn't open URL on simulator: " + url + "\n" + e.message);
    }
  }
  return url;
}

module.exports = {
  listSimulatorsAndTemplatesAsync,
  startSimulatorAsync,
  askUserToPickASimulatorAsync,
  listSimulatorsAsync,
  installExponentOnSimulatorAsync,
  openUrlOnSimulatorAsync,
  openUrlInUserChosenSimulatorAsync,
  chooseAndStartSimulatorAsync,
};

if (require.main === module) {
  if (process.argv[2]) {
    openUrlInUserChosenSimulatorAsync(process.argv[2]).then(console.log, console.error);
  } else {
    chooseAndStartSimulatorAsync().then(console.log, console.error);
  }
  //askUserToPickASimulatorAsync().then(startSimulatorAsync, console.error).then(console.log, console.error);
}
