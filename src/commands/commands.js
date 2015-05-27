var _ = require('lodash-node');

var commands = {

  // Basic
  init: () => require('./init'),
  start: () => require('./pm2serve').start,
  url: () => require('./url'),
  web: () => require('./web'),
  'start-simulator': () => require('./startSimulator'),
  open: () => require('./open'),
  stop: () => require('./pm2serve').stop,
  restart: () => {
    var restart = _.clone(require('./pm2serve').start);
    restart.name = 'restart';
    restart.description = "This is an alias of `start`. They both can be used to start or restart exp-serve";
    return restart;
  },
  send: () => require('./send'),

  // Publishing
  adduser: () => require('./adduser'),
  login: () => require('./login'),
  whoami: () => require('./whoami'),
  publish: () => require('./publish'),

  // Advanced
  bundle: () => require('./bundle'),
  status: () => require('./status'),
  logs: () => require('./logs'),
  version: () => require('./version'),
};

module.exports = commands;
