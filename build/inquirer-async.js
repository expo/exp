'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var co = require('co');
var inquirer = require('inquirer');

var promptAsync = co.wrap(function* (questions) {
  return new _Promise(function (fulfill, reject) {
    inquirer.prompt(questions, function (answers) {
      fulfill(answers);
    });
  });
});

module.exports = {
  promptAsync: promptAsync };

// Test
if (require.main === module) {
  var questions = [{
    type: 'input',
    name: 'question1',
    message: 'Question one',
    'default': 'some answer' }, {
    type: 'password',
    name: 'password',
    message: 'Password' }];
  promptAsync(questions).then(function (answers) {
    console.log('answers=', answers);
  });
}
//# sourceMappingURL=sourcemaps/inquirer-async.js.map