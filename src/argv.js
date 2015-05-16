var minimist = require('minimist');

var minimistOpts = {
  boolean: [
    'dev',
    'minify',

    'localhost',
    'lan',
    'ngrok',

    'qr',

    'test',
    'http',
    'redirect',

    'raw',
  ],
};

module.exports = minimist(process.argv.slice(2), minimistOpts);
