/**
 * Gets the configuration
 *
 */

'use strict';

var minimist = require('minimist');
var path = require('path');

var argv = minimist(process.argv.slice(2));

var relativePath = argv.path || argv.p || '.';
var absolutePath = path.resolve('.', relativePath);

var packagerPath = path.join(__dirname, '..', 'node_modules', 'react-native', 'packager', 'packager.sh');

module.exports = {
  relativePath: relativePath,
  absolutePath: absolutePath,
  argv: argv,
  packagerPath: packagerPath };
//# sourceMappingURL=sourcemaps/config.js.map