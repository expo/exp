'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var askForMobileNumberAsync = _asyncToGenerator(function* () {
  var phoneNumberFromSettings = yield userSettings.getAsync('phoneNumber', null);
  console.log("Enter a mobile number or e-mail and we'll send a link to your phone.");
  var answers = yield inquirerAsync.promptAsync([{
    type: 'input',
    name: 'mobileNumber',
    message: "Your mobile number or e-mail" + (phoneNumberFromSettings ? " (space to not send anything)" : '') + ":",
    'default': phoneNumberFromSettings
  }]);
  return answers.mobileNumber.trim();
});

var inquirerAsync = require('inquirer-async');

var userSettings = require('./userSettings');

module.exports = {
  askForMobileNumberAsync: askForMobileNumberAsync
};

if (require.main === module) {
  askForMobileNumberAsync().then(function (mobileNumber) {
    console.log("Your mobile number is", mobileNumber);
  });
}
//# sourceMappingURL=sourcemaps/askUser.js.map