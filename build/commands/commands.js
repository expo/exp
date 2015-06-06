'use strict';

var _ = require('lodash-node');

var commands = {

  // Basic
  init: function init() {
    return require('./init');
  },
  start: function start() {
    return require('./pm2serve').start;
  },
  url: function url() {
    return require('./url');
  },
  web: function web() {
    return require('./web');
  },
  //'start-simulator': () => require('./startSimulator'),
  //open: () => require('./open'),
  stop: function stop() {
    return require('./pm2serve').stop;
  },
  restart: function restart() {
    var restart = _.clone(require('./pm2serve').start);
    restart.name = 'restart';
    restart.description = 'This is an alias of `start`. They both can be used to start or restart exp-serve';
    return restart;
  },
  send: function send() {
    return require('./send');
  },

  // Publishing
  adduser: function adduser() {
    return require('./adduser');
  },
  login: function login() {
    return require('./login');
  },
  whoami: function whoami() {
    return require('./whoami');
  },
  publish: function publish() {
    return require('./publish');
  },

  // Advanced
  bundle: function bundle() {
    return require('./bundle');
  },
  status: function status() {
    return require('./status');
  },
  logs: function logs() {
    return require('./logs');
  },
  version: function version() {
    return require('./version');
  } };

module.exports = commands;
//# sourceMappingURL=../sourcemaps/commands/commands.js.map