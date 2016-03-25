/**
 * Gets the configuration
 *
 */

import {
  ProjectSettings,
} from 'xdl';

var jsonFile = require('@exponent/json-file');
var path = require('path');

var argv = require('./argv');

var relativePath = argv.path || '.';
var absolutePath = path.resolve('.', relativePath);

function projectExpJsonFile(projectRoot) {
  let jsonFilePath = path.join(ProjectSettings.dotExponentProjectDirectory(projectRoot), 'exp-cli.json');
  return new jsonFile(jsonFilePath, {cantReadFileDefault: {}});
}

var packageJsonFile = jsonFile('package.json');

module.exports = {
  relativePath,
  absolutePath,
  argv,
  projectExpJsonFile,
  packageJsonFile,
};
