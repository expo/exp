import {
  Simulator,
} from 'xdl';

async function action(options) {
  await Simulator.openSimulatorAsync();
}

module.exports = (program) => {
  program
    .command('simulator-start')
    .description('Opens the iOS simulator')
    //.help('Must have Xcode installed')
    .asyncAction(action);
};
