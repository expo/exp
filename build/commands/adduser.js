'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _ = require('lodash-node');
var co = require('co');
var inquirerAsync = require('inquirer-async');
var instapromise = require('instapromise');

var api = require('../api');
var CommandError = require('./CommandError');
var password = require('../password');
var userSettings = require('../userSettings');

module.exports = {
  name: 'adduser',
  description: 'Creates a user on exp.host',
  help: '',
  runAsync: co.wrap(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var _args = _slicedToArray(args, 6);

    var _cmd = _args[0];
    var username = _args[1];
    var cleartextPassword = _args[2];
    var fullName = _args[3];
    var email = _args[4];
    var phoneNumber = _args[5];

    username = username || argv.username;
    cleartextPassword = cleartextPassword || argv.password;
    email = email || argv.email;
    phoneNumber = phoneNumber || argv.phoneNumber;
    fullName = fullName || argv.fullName;

    var settingsData = yield userSettings.readFileAsync();

    var questions = [];

    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'username',
        'default': settingsData.username,
        validate: function validate(val) {
          // TODO: Validate username here
          return true;
        } });
    }

    if (!cleartextPassword) {
      questions.push({
        type: 'password',
        name: 'cleartextPassword',
        message: 'password',
        validate: function validate(val) {
          // TODO: Validate
          return true;
        } });
    }

    if (!fullName && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'fullName',
        message: 'Full Name',
        validate: function validate(val) {
          // TODO: Validate
          return true;
        } });
    }

    if (!email && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'email',
        message: 'E-mail address',
        'default': settingsData.email });
    }

    if (!phoneNumber && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'phoneNumber',
        message: 'Mobile phone number',
        'default': settingsData.phoneNumber });
    }

    // TODO: Make this more of a Promise/yieldable situation so we can continue inline here
    var answers = yield inquirerAsync.promptAsync(questions);

    var data = {
      username: username || answers.username,
      cleartextPassword: cleartextPassword || answers.cleartextPassword,
      email: email || answers.email,
      phoneNumber: phoneNumber || answers.phoneNumber };

    // Store only the hashed version of someone's password
    data.hashedPassword = password.hashPassword(data.cleartextPassword);
    delete data.cleartextPassword;

    var result = yield api.callMethodAsync('adduser', data);

    var user = result.user;

    if (user) {
      yield userSettings.writeFileAsync(user);
      return result;
    } else {
      console.log('result=', result);
      throw new Error('Unexpected Error: No user returned from the API');
    }
  }) };
//# sourceMappingURL=../sourcemaps/commands/adduser.js.map