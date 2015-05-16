/**
 * Gets the configuration
 *
 */

'use strict';

var jsonFile = require('@exponent/json-file');
var path = require('path');

var argv = require('./argv');

var relativePath = argv.path || '.';
var absolutePath = path.resolve('.', relativePath);

var packagerPath = path.join(__dirname, '..', 'node_modules', 'react-native', 'packager', 'packager.sh');

var expInfoFile = jsonFile('.exp.json', { cantReadFileDefault: {} });
var packageJsonFile = jsonFile('package.json');

module.exports = {
  relativePath: relativePath,
  absolutePath: absolutePath,
  argv: argv,
  packagerPath: packagerPath,
  expInfoFile: expInfoFile,
  packageJsonFile: packageJsonFile };
//# sourceMappingURL=sourcemaps/config.js.map