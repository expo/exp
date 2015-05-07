'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var fs = require('fs');
var instapromise = require('instapromise');
var path = require('path');

var log = require('../log');

module.exports = {
  name: 'new',
  description: 'Sets up a new project',
  help: '',
  runAsync: _asyncToGenerator(function* (env) {

    var js = yield fs.promise.readFile(path.join(__dirname, '..', '..', 'main.js'), 'utf8');
    var newIndexPath = path.join('.', 'index.js');
    yield fs.promise.writeFile(newIndexPath, js, 'utf8');
    log('Saved your new project at', newIndexPath);
  }) };
//# sourceMappingURL=../sourcemaps/commands/new.js.map