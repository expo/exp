var fs = require('fs');
var instapromise = require('instapromise');
var path = require('path');

var log = require('../log');

module.exports = {
  name: 'new',
  description: "Sets up a new project",
  help: "",
  runAsync: async function (env) {

    var js = await fs.promise.readFile(path.join(__dirname, '..', '..', 'main.js'), 'utf8');
    var newIndexPath = path.join('.', 'index.js');
    await fs.promise.writeFile(newIndexPath, js, 'utf8');
    log("Saved your new project at", newIndexPath);

  },
};
