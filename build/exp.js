#!/usr/bin/env node
"use strict";

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var child_process = require("child_process");
var co = require("co");
var crayon = require("@ccheever/crayon");
var instapromise = require("instapromise");
var minimist = require("minimist");
var ngrok = require("ngrok");
var path = require("path");
var request = require("request");

var URL_FILE = ".exponent.url";

module.exports = function (command, argv) {
  switch (command) {

    case "help":
    case void 0:
      return co(function* () {
        console.log("Usage: exp <command>\n" + "\n" + "where <command> is one of:\n" + "    serve, send, snapshot, help\n" + "\n" + "exp help <cmd>     search for help on <cmd>\n");
      });
      break;

    case "send":
      return co(function* () {
        var urlFilePath = path.join(__dirname, URL_FILE);
        var url;
        var err = null;
        try {
          url = yield fs.promise.readFile(url, "utf8");
          try {
            var _ref = yield request.promise.get(url);

            var _ref2 = _slicedToArray(_ref, 2);

            var response = _ref2[0];
            var body = _ref2[1];
          } catch (e) {
            err = new Error("Couldn't reach the URL " + url + ". Did you kill your server?");
          }
        } catch (e) {
          err = new Error("You need to run `exp serve` before you have a URL you can send");
        }
        if (err) {
          console.error(err);
          throw err;
        } else {
          console.log("url=", url);
        }
      });
      break;

    case "serve":
      return co(function* () {
        var ngrokAuthToken, ngrokSubdomain, packager, port, url, urlP;
        ngrokSubdomain = argv["ngrok-subdomain"];
        ngrokAuthToken = argv["ngrok-auth-token"];
        port = argv.port;
        if (port == null) {
          port = 9000 + Math.floor(Math.random() * 1000);
        }
        urlP = ngrok.promise.connect({
          port: port,
          authtoken: ngrokAuthToken,
          subdomain: ngrokSubdomain
        });
        var pp = path.join(__dirname, "node_modules", "react-native", "packager", "packager.sh");
        var root = path.resolve(__dirname, "..", "..");
        packager = child_process.spawn(pp, ["--port=" + port, "--root=" + root, "--assetRoots=" + root], {
          stdio: [process.stdin, process.stdout, process.stderr] });
        url = (yield [urlP])[0];
        var urlFilePath = path.join(__dirname, URL_FILE);
        crayon.log("Started packager and ngrok\nYour URL is\n" + crayon.bold(url) + "\n");
        yield fs.promise.writeFile(urlFilePath, url);
      });
      break;

    default:
      return console.error("The only command that works right now is `start`");
      break;

  }
};

if (require.main === module) {
  var argv = minimist(process.argv.slice(2));
  module.exports(argv._[0], argv);
}
//# sourceMappingURL=sourcemaps/exp.js.map