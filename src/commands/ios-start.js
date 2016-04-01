import {
  Simulator,
} from 'xdl';

async function action(options) {
  await Simulator.openSimulatorAsync();
}

module.exports = (program) => {
  program
    .command('ios-start')
    .description('Starts the iOS simulator')
    //.help('Must have Xcode installed')
    .asyncAction(action);
};
