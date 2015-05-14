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
  description: "Creates a user on exp.host",
  help: "",
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;
    var [_cmd, username, cleartextPassword, fullName, email, phoneNumber] = args;
    username = username || argv.username;
    cleartextPassword = cleartextPassword || argv.password
    email = email || argv.email;
    phoneNumber = phoneNumber || argv.phoneNumber;
    fullName = fullName || argv.fullName;

    var settingsData = await userSettings().readAsync();

    var questions = [];

    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'username',
        default: settingsData.username,
        validate: function (val) {
          // TODO: Validate username here
          return true;
        },
      });
    }

    if (!cleartextPassword) {
      questions.push({
        type: 'password',
        name: 'cleartextPassword',
        message: 'password',
        validate: function (val) {
          // TODO: Validate
          return true;
        },
      });
    }

    if (!fullName && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'fullName',
        message: 'Full Name',
        default: settingsData.fullName,
        validate: function (val) {
          // TODO: Validate
          return true;
        },
      });
    }

    if (!email && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'email',
        message: "E-mail address",
        default: settingsData.email,
      });
    }

    if (!phoneNumber && !env.isLogin) {
      questions.push({
        type: 'input',
        name: 'phoneNumber',
        message: 'Mobile phone number',
        default: settingsData.phoneNumber,
      });
    }

    // TODO: Make this more of a Promise/yieldable situation so we can continue inline here
    var answers = await inquirerAsync.promptAsync(questions);

    var data = {
      username: username || answers.username,
      cleartextPassword: cleartextPassword || answers.cleartextPassword,
      email: email || answers.email,
      phoneNumber: phoneNumber || answers.phoneNumber,
      fullName: fullName || answers.fullName,
    };

    // Store only the hashed version of someone's password
    data.hashedPassword = password.hashPassword(data.cleartextPassword);
    delete data.cleartextPassword;

    var result = await api.callMethodAsync('adduser', data);

    var user = result.user;
    user.hashedPassword = data.hashedPassword;

    if (user) {
      await userSettings().mergeAsync(user);
      return result;
    } else {
      throw new Error("Unexpected Error: No user returned from the API");
    }

  },
};
