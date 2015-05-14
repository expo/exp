/**
 * Gets the configuration
 *
 */

var jsonFile = require('@exponent/json-file');
var minimist = require('minimist');
var path = require('path');

var argv = minimist(process.argv.slice(2));

var relativePath = argv.path || argv.p || '.';
var absolutePath = path.resolve('.', relativePath);

var packagerPath = path.join(__dirname, '..', 'node_modules', 'react-native', 'packager', 'packager.sh');

var expInfoFile = jsonFile('.exp.json', {cantReadFileDefault: {}});
var packageJsonFile = jsonFile('package.json');

module.exports = {
  relativePath,
  absolutePath,
  argv,
  packagerPath,
  expInfoFile,
  packageJsonFile,
};
