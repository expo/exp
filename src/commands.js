var _ = require('lodash-node');

var commands = {

  // Basic
  init: () => require('./commands/init'),
  start: () => require('./commands/pm2serve').start, //done
  url: () => require('./commands/url'), // done
  //'start-simulator': () => require('./startSimulator'),
  open: () => require('./commands/open'),
  stop: () => require('./commands/pm2serve').stop, // done
  restart: () => {
    var restart = _.clone(require('./commands/pm2serve').start);
    restart.name = 'restart';
    restart.description = "This is an alias of `start`. They both can be used to start or restart exp-serve";
    return restart;
  }, // done
  send: () => require('./commands/send'), // done

  // Publishing
  adduser: () => require('./commands/adduser'), // done
  login: () => require('./commands/login'), // done
  logout: () => require('./commands/logout'), // done
  whoami: () => require('./commands/whoami'), // done
  publish: () => require('./commands/publish'),

  // Advanced
  status: () => require('./commands/status'), // done
  logs: () => require('./commands/logs'), // done
  version: () => require('./commands/version'), // done
};

module.exports = commands;
