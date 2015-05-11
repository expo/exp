var _ = require('lodash-node');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var mkdirp = require('mkdirp');
var path = require('path');

// TODO: Make this more configurable
function userSettingsFile() {
  return path.join(dotExponentDirectory(), 'exponent.json');
}

function dotExponentDirectory() {
  if (!process.env.HOME) {
    throw new Error("Can't determine your home directory; make sure your $HOME environment variable is set.");
  }
  return path.join(process.env.HOME, '.exponent');
}

async function writeFileAsync(data) {
  await mkdirp.promise(dotExponentDirectory());
  return jsonFile.writeAsync(userSettingsFile(), data);
}

async function readFileAsync() {
  return jsonFile.readAsync(userSettingsFile(), {cantReadFileDefault:{}});
}

async function mergeFileAsync(data) {
  return jsonFile.mergeAsync(userSettingsFile(), data);
}

module.exports = {
  mergeFileAsync,
  readFileAsync,
  userSettingsFile,
  writeFileAsync,
};
