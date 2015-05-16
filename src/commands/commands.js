var commands = {
  //serve: require('./serve'),
  init: require('./init'),
  start: require('./pm2serve').start,
  stop: require('./pm2serve').stop,
  restart: require('./pm2serve').start,
  url: require('./url'),
  send: require('./send'),
  adduser: require('./adduser'),
  login: require('./login'),
  bundle: require('./bundle'),
  logs: require('./logs'),
};

module.exports = commands;
