var _ = require('lodash-node');

import {
  ProjectSettings,
} from 'xdl';

var CommandError = require('./CommandError');

var addOptions = function (program) {
  program
    .option('-h, --host [mode]', 'ngrok (default), lan, localhost')
    .option('-p, --protocol [mode]', 'exp (default), http, redirect')
    .option('--ngrok', 'Same as --host ngrok')
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

async function optsAsync(projectDir, options) {
  var opts = await ProjectSettings.readAsync(projectDir);

  if ((!!options.host + !!options.lan + !!options.localhost + !!options.ngrok) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --host, --ngrok, --lan, and --localhost");
  }

  if ((!!options.protocol + !!options.exp + !!options.http + !!options.redirect) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --protocol, --exp, --http, and --redirect");
  }

  if (options.host) { opts.hostType = options.host; }
  if (options.ngrok) { opts.hostType = 'ngrok'; }
  if (options.lan) { opts.hostType = 'lan'; }
  if (options.localhost) { opts.hostType = 'localhost'; }

  if (options.dev) { opts.dev = true; }
  if (options.strict) { opts.strict = true; }
  if (options.minify) { opts.minify = true; }

  if (options.noDev) { opts.dev = false; }
  if (options.noStrict) { opts.strict = false; }
  if (options.noMinify) { opts.minify = false; }

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
