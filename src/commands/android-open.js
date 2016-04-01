import {
  Android,
  UrlUtils,
} from 'xdl';

async function action(projectDir, options) {
  let url = await UrlUtils.constructManifestUrlAsync(projectDir);

  await Android.openUrlWithAdbAsync(url);
}

module.exports = (program) => {
  program
    .command('android-open')
    .description('Opens your app in Exponent on a connected Android device')
    //.help('You must already have Exponent installed on a simulator on your computer.')
    .asyncActionProjectDir(action);
};
