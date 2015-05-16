var _ = require('lodash-node');

var commands = {

  // Basic
  init: require('./init'),
  start: require('./pm2serve').start,
  url: require('./url'),
  stop: require('./pm2serve').stop,
  //restart: _.clone(require('./pm2serve').start),
  send: require('./send'),

  // Publishing
  adduser: require('./adduser'),
  login: require('./login'),
  whoami: require('./whoami'),

  // Advanced
  bundle: require('./bundle'),
  status: require('./status'),
  logs: require('./logs'),
};

//commands.restart.name = 'restart';

module.exports = commands;
