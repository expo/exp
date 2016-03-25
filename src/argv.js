var minimist = require('minimist');

var minimistOpts = {
  boolean: [
    'ngrok',
    'lan',
    'localhost',
    'dev',
    'strict',
    'minify',
    'exp',
    'http',
    'redirect',
    'qr',
    'raw',
  ],
};

module.exports = minimist(process.argv.slice(2), minimistOpts);
