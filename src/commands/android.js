import {
  Android,
  UrlUtils,
} from 'xdl';

var log = require('../log');

import {
  addUrlOption,
} from '../urlOpts';

async function action(projectDir, options) {
  let url = options.url || await UrlUtils.constructManifestUrlAsync(projectDir);

  await Android.openUrlSafeAsync(url, log, log);
}

module.exports = (program) => {
  addUrlOption(
    program
      .command('android [project-dir]')
      .description('Opens your app in Exponent on a connected Android device')
      //.help('You must already have Exponent installed on a simulator on your computer.')
      .asyncActionProjectDir(action)
  );
};
