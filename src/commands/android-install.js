import {
  Android,
} from 'xdl';

async function action(options) {
  await Android.installExponentWithAdbAsync();
}

module.exports = (program) => {
  program
    .command('android-install')
    .description('Opens the Play Store page for Exponent on a connected Android device')
    //.help('Must have Xcode installed')
    .asyncAction(action);
};
