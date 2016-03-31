import {
  Simulator,
} from 'xdl';

async function action(options) {
  await Simulator.installExponentOnSimulatorAsync();
}

module.exports = (program) => {
  program
    .command('simulator-install')
    .description('Installs the Exponent app on the iOS simulator')
    //.help('Must have Xcode installed')
    .asyncAction(action);
};
