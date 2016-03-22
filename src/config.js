/**
 * Gets the configuration
 *
 */

var jsonFile = require('@exponent/json-file');
var path = require('path');

var argv = require('./argv');

var relativePath = argv.path || '.';
var absolutePath = path.resolve('.', relativePath);

var packageJsonFile = jsonFile('package.json');

module.exports = {
  relativePath,
  absolutePath,
  argv,
  packageJsonFile,
};
