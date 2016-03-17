var _ = require('lodash-node');

var commands = {

  // Basic
  init: () => require('./commands/init'),
  start: () => require('./commands/pm2serve').start,
  url: () => require('./commands/url'),
  web: () => require('./commands/web'),
  //'start-simulator': () => require('./startSimulator'),
  open: () => require('./commands/open'),
  stop: () => require('./commands/pm2serve').stop,
  restart: () => {
    var restart = _.clone(require('./commands/pm2serve').start);
    restart.name = 'restart';
    restart.description = "This is an alias of `start`. They both can be used to start or restart exp-serve";
    return restart;
  },
  send: () => require('./commands/send'),

  // Publishing
  adduser: () => require('./commands/adduser'),
  login: () => require('./commands/login'),
  logout: () => require('./commands/logout'),
  whoami: () => require('./commands/whoami'),
  publish: () => require('./commands/publish'),

  // Advanced
  bundle: () => require('./commands/bundle'),
  status: () => require('./commands/status'),
  logs: () => require('./commands/logs'),
  version: () => require('./commands/version'),
};

module.exports = commands;
