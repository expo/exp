import {
  Exp,
} from 'xdl';

var log = require('../log');

async function action(projectDir, options) {
  await Exp.createNewExpAsync(projectDir, {}, {force: true});
  log(`Your project is ready at ${projectDir}. Use "exp start ${projectDir}" to get started.`)
}

module.exports = (program) => {
  program
    .command('init [project-dir]')
    .alias('i')
    .description('Initializes a directory so it can be used with exp')
    .asyncActionProjectDir(action);
};
