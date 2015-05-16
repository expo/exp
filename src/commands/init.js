var fs = require('fs');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var mkdirp = require('mkdirp');
var path = require('path');

var spawnAsync = require('@exponent/spawn-async');

var CommandError = require('./CommandError');
var log = require('../log');

module.exports = {
  name: 'init',
  description: "Initializes a directory so it can be used with exp",
  help: "Asks you questions and then sets up a directory",
  args: ['[path-to-project-dir]'],
  runAsync: async function (env) {
    var argv = env.argv;
    var args = argv._;

    // Here is what this will do

    // 0. If there is a command line argument, make a new directory in the current directory and chdir to it
    var dirName = args[1];
    if (dirName) {
      await mkdirp.promise(dirName);
      process.chdir(dirName);
    }

    // 1. If there is no package.json in the current directory, run npm init
    var pkgJsonFile = jsonFile('package.json');
    var pkg;
    try {
      pkg = await pkgJsonFile.readAsync();
    } catch (e) {
      console.error(e);

      // No package.json, so let's create it
      log("No package.json file found. Using `npm init` to help you create one.");
      log("Answer the questions and a package.json will be created for you.");
      var _zero = await spawnAsync('npm', ['init'], {stdio: 'inherit'});
      pkg = await pkgJsonFile.readAsync();
    }

    var entryPoint = pkg.main || 'index.js';

    // 2. Figure out the entry point of the app. Try to create that file with the template
    //    ... but fail if it already exist

    var js = await fs.promise.readFile(path.join(__dirname, '..', '..', 'example', 'main.js'), 'utf8');
    try {
      await fs.promise.writeFile(entryPoint, js, {encoding: 'utf8', flag: 'wx'});
      log("Created an entry point for your app at", entryPoint);
    } catch (e) {
      log.warn("The entry point (" + entryPoint + ") already exists; refusing to overwrite.\n" + e + "\nIf you want to use the standard template sample file,\ndelete that file and rerun `exp init` again.")
      //throw CommandError('ENTRY_POINT_EXISTS', env, "The entry point (" + entryPoint + ") already exists; refusing to overwrite.\n" + e + "\nDelete that file and rerun `exp init` to try again.");
    }


  },
};
