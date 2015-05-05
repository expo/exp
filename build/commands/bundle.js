'use strict';

var co = require('co');
var crayon = require('@ccheever/crayon');
var fs = require('fs');
var instapromise = require('instapromise');
var request = require('request');

var log = require('../log');
var urlUtil = require('../urlUtil');

module.exports = {
  name: 'bundle',
  description: 'Saves the current bundle of your app to the terminal or a file',
  help: '',
  runAsync: co.wrap(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var filepath = args[1];
    var outStream = process.stdout;
    if (filepath) {
      outStream = fs.createWriteStream(filepath);
    }

    var url = yield urlUtil.mainBundleUrlAsync();
    log('Requesting bundle from', url);
    if (filepath) {
      log('Saving to', filepath);
    }

    try {
      var response = yield request.promise.get(url);
      if (response.statusCode != 200) {
        throw new Error('Non-200 response: ' + response.statusCode + ': ' + response.statusMessage);
      }
    } catch (e) {
      throw new Error('Failed to download bundle; did you run `exp serve`?\n' + e);
    }

    var bytes = yield outStream.promise.write(response.body);
    if (filepath) {
      outStream.close();
    }

    var result = {
      err: null,
      url: url,
      bytes: bytes };

    if (filepath) {
      result.savedTo = filepath;
    }

    return result;
  }) };
//# sourceMappingURL=../sourcemaps/commands/bundle.js.map