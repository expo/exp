import {
  Simulator,
  UrlUtils,
} from 'xdl';

async function action(projectDir, options) {
  let url = await UrlUtils.constructManifestUrlAsync(projectDir, {
    localhost: true,
  });

  await Simulator.openUrlInSimulatorAsync(url);
  await Simulator.openSimulatorAsync();
}

module.exports = (program) => {
  program
    .command('simulator-open')
    .description('Opens your app in Exponent in a currently running iOS simulator on your computer')
    //.help('You must already have Exponent installed on a simulator on your computer.')
    .asyncActionProjectDir(action);
};
