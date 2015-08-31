'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var jsonFile = require('@exponent/json-file');
var path = require('path');

module.exports = {
  name: 'value',
  description: "Displays the version of exp that you are using",
  help: "Displays the version of exp you are using. `exp` is versioned using semver (http://semver.org/) and the version is always described in the `package.json` file and matches the version number in `npm`.",
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var version = yield jsonFile.getAsync(path.join(__dirname, '..', '..', 'package.json'), 'version');
    console.log(version);
  })
};
//# sourceMappingURL=../sourcemaps/commands/version.js.map