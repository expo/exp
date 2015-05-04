/**
 * Gets the configuration
 *
 */

var DEFAULT_URL_FILE = '.exponent.url';

var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var path = argv.path || argv.p || '.';

module.exports;
