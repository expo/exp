/**
 * Gets the configuration
 *
 */

import {
  ProjectSettings,
} from 'xdl';

var jsonFile = require('@exponent/json-file');
var path = require('path');

function projectExpJsonFile(projectRoot) {
  let jsonFilePath = path.join(ProjectSettings.dotExponentProjectDirectory(projectRoot), 'exp-cli.json');
  return new jsonFile(jsonFilePath, {cantReadFileDefault: {}});
}

var packageJsonFile = jsonFile('package.json');

module.exports = {
  projectExpJsonFile,
  packageJsonFile,
};
