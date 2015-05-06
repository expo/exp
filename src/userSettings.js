var co = require('co');
var fs = require('fs');
var instapromise = require('instapromise');
var path = require('path');

// TODO: Make this more configurable
function userSettingsFile() {
  return path.join(process.env.HOME, '.exponent.json');
}

var writeFileAsync = co.wrap(function *(data) {
  yield fs.promise.writeFile(userSettingsFile(), JSON.stringify(data, null, 2), 'utf8');
  return data;
});

var readFileAsync = co.wrap(function *() {
  try {
    var json = yield fs.promise.readFile(userSettingsFile(), 'utf8');
  } catch (e) {
    // File not found or not readable
    return {};
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Invalid JSON in settings file " + userSettingsFile() + ":" + e);
  }
});

module.exports = {
  userSettingsFile,
  writeFileAsync,
  readFileAsync,
};
