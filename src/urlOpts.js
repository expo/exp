var _ = require('lodash-node');

import {
  ProjectSettings,
} from 'xdl';

var CommandError = require('./CommandError');

var addOptions = function (program) {
  program
    .option('-m, --host [mode]', 'tunnel (default), lan, localhost. Type of host to use. "tunnel" allows you to view your link on other networks')
    .option('-p, --protocol [mode]', 'exp (default), http, redirect. Type of protocol. "exp" is recommended right now')
    .option('--tunnel', 'Same as --host tunnel')
    .option('--lan', 'Same as --host lan')
    .option('--localhost', 'Same as --host localhost')
    .option('--dev', 'Turns dev flag on')
    .option('--no-dev', 'Turns dev flag off')
    .option('--strict', 'Turns strict flag on')
    .option('--no-strict', 'Turns strict flag off')
    .option('--minify', 'Turns minify flag on')
    .option('--no-minify', 'Turns minify flag off')
    .option('--exp', 'Same as --protocol exp')
    .option('--http', 'Same as --protocol http')
    .option('--redirect', 'Same as --protocol redirect');
}

function hasBooleanArg(rawArgs, argName) {
  return _.includes(rawArgs, '--' + argName) || _.includes(rawArgs, '--no-' + argName);
}

function getBooleanArg(rawArgs, argName) {
  if (_.includes(rawArgs, '--' + argName)) {
    return true;
  } else {
    return false;
  }
}

async function optsAsync(projectDir, options) {
  var opts = await ProjectSettings.readAsync(projectDir);

  if ((!!options.host + !!options.lan + !!options.localhost + !!options.tunnel) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --host, --tunnel, --lan, and --localhost");
  }

  if ((!!options.protocol + !!options.exp + !!options.http + !!options.redirect) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --protocol, --exp, --http, and --redirect");
  }

  if (options.host) { opts.hostType = options.host; }
  if (options.tunnel) { opts.hostType = 'ngrok'; }
  if (options.lan) { opts.hostType = 'lan'; }
  if (options.localhost) { opts.hostType = 'localhost'; }

  let rawArgs = options.parent.rawArgs;
  if (hasBooleanArg(rawArgs, 'dev')) { opts.dev = getBooleanArg(rawArgs, 'dev'); }
  if (hasBooleanArg(rawArgs, 'strict')) { opts.strict = getBooleanArg(rawArgs, 'strict'); }
  if (hasBooleanArg(rawArgs, 'minify')) { opts.minify = getBooleanArg(rawArgs, 'minify'); }

  if (options.protocol) { opts.urlType = options.protocol; }
  if (options.exp) { opts.urlType = 'exp'; }
  if (options.http) { opts.urlType = 'http'; }
  if (options.redirect) { opts.urlType = 'redirect'; }

  await ProjectSettings.setAsync(projectDir, opts);

  return opts;
}

module.exports = {
  addOptions,
  optsAsync,
};
