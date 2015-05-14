var commands = {
  serve: require('./pm2serve'),
  url: require('./url'),
  bundle: require('./bundle'),
  adduser: require('./adduser'),
  login: require('./login'),
  new: require('./new'),
};

module.exports = commands;
