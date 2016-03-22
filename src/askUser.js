var inquirerAsync = require('inquirer-async');

import {
  UserSettings,
} from 'xdl';

async function askForMobileNumberAsync() {
  var phoneNumberFromSettings = await UserSettings.getAsync('phoneNumber', null);
  console.log("Enter a mobile number or e-mail and we'll send a link to your phone.");
  var answers = await inquirerAsync.promptAsync([{
    type: 'input',
    name: 'mobileNumber',
    message: "Your mobile number or e-mail" + (phoneNumberFromSettings ? " (space to not send anything)" : '') + ":",
    default: phoneNumberFromSettings,
  }]);
  return answers.mobileNumber.trim();
}

module.exports = {
  askForMobileNumberAsync,
};

if (require.main === module) {
  askForMobileNumberAsync().then(function (mobileNumber) {
    console.log("Your mobile number is", mobileNumber);
  });
}
