var _ = require('lodash-node');

import {
  ProjectSettings,
} from 'xdl';

var CommandError = require('./CommandError');

var options = function () {
    return [
      ['--ngrok', "Use the ngrok URL (default)"],
      ['--lan', "Use the LAN URL"],
      ['--localhost', "Use the localhost URL"],
      ['--dev', "Have the packager generate a dev bundle"],
      ['--strict', "Have the packager use strict mode on the bundle"],
      ['--minify', "Have the packager minify the bundle"],
      ['--exp', "Generate an exp:// URL (default)"],
      ['--http', "Generate an http:// URL instead of an exp:// URL"],
      ['--redirect', "Generates an HTTP URL that will redirect you to your desired URL"],
    ];
}

async function optsFromEnvAsync(env, def) {
  var argv = env.argv;
  var args = argv._;
  var projectDir = args[1] || process.cwd();

  var opts = await ProjectSettings.readAsync(projectDir);

  if ((!!argv.lan + !!argv.localhost + !!argv.ngrok) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --ngrok, --lan, and --localhost");
  }

  if ((!!argv.exp + !!argv.http + !!argv.redirect) > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --exp, --http, and --redirect");
  }

  if (argv.ngrok) { opts.hostType = 'ngrok'; }
  if (argv.lan) { opts.hostType = 'lan'; }
  if (argv.localhost) { opts.hostType = 'localhost'; }

  opts.dev = !!argv.dev;
  opts.strict = !!argv.strict;
  opts.minify = !!argv.minify;

  if (argv.exp) { opts.urlType = 'exp'; }
  if (argv.http) { opts.urlType = 'http'; }
  if (argv.redirect) { opts.urlType = 'redirect'; }

  await ProjectSettings.setAsync(projectDir, opts);

  return opts;
}

module.exports = {
  options,
  optsFromEnvAsync,
};
