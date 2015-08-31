'use strict';

var _ = require('lodash-node');

var CommandError = require('./CommandError');

var options = function options(def) {
  return [['--lan', "Use the LAN URL" + (def === 'lan' ? " (default)" : '')], ['--localhost', "Use the localhost URL" + (def === 'localhost' ? " (default)" : '')], ['--ngrok', "Use the ngrok URL" + (def === 'ngrok' ? " (default)" : '')], ['--redirect', "Generates an HTTP URL that will redirect you to your desired URL"], ['--dev', "Have the packager generate a dev bundle"], ['--minify', "Have the packager minify the bundle"], ['--mainModulePath', "Specify the path to the main module"], ['--notest', "Don't bother testing the URL"], ['--http', "Generate an http:// URL instead of an exp:// URL"], ['--web', "Generate a URL you can use to view your article in the Appetize web simulator"], ['--short', "Generes a shortened URL that is easy to type in"]];
};

function optsFromEnv(env, def) {

  var opts = _.clone(def);

  var argv = env.argv;

  if (!!argv.lan + !!argv.localhost + !!argv.ngrok > 1) {
    throw CommandError('BAD_ARGS', env, "Specify at most one of --lan, --localhost, and --ngrok");
  }

  if (!!argv.web && (!!argv.lan || !!argv.localhost)) {
    throw CommandError('BAD_ARGS', env, "You can only generate web simulator URLs with ngrok");
  }

  if (argv.lan) {
    opts.type = 'lan';
  }
  if (argv.localhost) {
    opts.type = 'localhost';
  }
  if (argv.ngrok) {
    opts.type = 'ngrok';
  }

  if (argv.web) {
    opts.web = true;
  }

  if (argv.dev) {
    opts.dev = true;
  }

  if (argv.nodev) {
    opts.dev = false;
  }

  if (argv.minify) {
    opts.minify = true;
  }

  if (argv.nominify) {
    opts.minify = false;
  }

  if (argv.short) {
    opts.short = true;
  }

  opts.mainModulePath = argv.mainModulePath;

  return opts;
}

module.exports = {
  options: options,
  optsFromEnv: optsFromEnv
};
//# sourceMappingURL=../sourcemaps/commands/urlOpts.js.map