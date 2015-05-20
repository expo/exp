'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var crayon = require('@ccheever/crayon');
var windowSize = require('window-size');
var wordwrap = require('wordwrap');

var CommandError = require('./CommandError');
var commands = require('./commands');

function showHelp(command) {
  var argsString = command.args ? command.args.join(' ') : '';
  console.error('Usage: exp ' + command.name + ' ' + argsString);
  console.error();
  if (command.description) {
    console.error(wordwrap(windowSize.width)(command.description));
    console.error();
  }
  if (command.options) {
    var longest = 0;
    for (var option of command.options) {
      var _option = _slicedToArray(option, 3);

      var o = _option[0];
      var d = _option[1];
      var def = _option[2];

      if (o.length > longest) {
        longest = o.length;
      }
    }
    var prefix = '    ';
    for (var option of command.options) {
      var _option2 = _slicedToArray(option, 3);

      var o = _option2[0];
      var d = _option2[1];
      var def = _option2[2];

      console.error(prefix + o + _spaces(longest - o.length) + '  ' + _indentHelp(d, prefix.length + longest + 2));
    }
    console.error();
  }
  if (command.help) {
    console.error('  ' + _indentHelp(command.help, 2));
  }
}

function _indentHelp(help, ind) {
  var maxWidth = windowSize.width;
  if (ind > maxWidth - 6) {
    return '\n' + help + '\n';
  }
  var wrapped = wordwrap(maxWidth - ind)(help);
  var lines = wrapped.split('\n');
  var s = '';
  for (var i = 0; i < lines.length; i++) {
    if (i > 0) {
      for (var j = 0; j < ind; j++) {
        s += ' ';
      }
    }
    s += lines[i] + '\n';
  }
  // s = s.trim();
  return s;
}

function _spaces(n) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += ' ';
  }
  return s;
}

module.exports = {
  name: 'help',
  description: 'Shows help for `exp` or for a given command.',
  args: ['[command]'],
  options: [],
  help: 'You can also do `exp <command> --help` for any command or `exp --help` to get help',
  runAsync: _asyncToGenerator(function* (env) {
    var argv = env.argv;
    var args = argv._;

    var cmd = args[0];
    var command = {};
    if (cmd) {
      if (cmd === 'help') {
        command = module.exports;
      } else {
        command = commands[cmd]();
      }
      if (!command) {
        throw CommandError('UNKNOWN_COMMAND', env, 'No such command: ' + cmd);
      }
      showHelp(command);
    } else {
      var commandKeys = _Object$keys(commands);
      var script = env.script || 'exp';
      console.error('Usage: ' + script + ' <command>\n' + '\n' + 'where <command> is one of:\n' + '    ' + commandKeys.join(', ') + '\n' + '\n');

      var prefix = '    exp ';
      var longest = 0;
      for (var key of commandKeys) {
        var command = commands[key]();
        if (command.name.length > longest) {
          longest = command.name.length;
        }
      }
      var ind = prefix.length + longest + 2;
      for (var i = -1; i < commandKeys.length; i++) {
        var command;
        if (i === -1) {
          command = module.exports;
        } else {
          var key = commandKeys[i];
          command = commands[key]();
        }
        console.error(prefix + command.name + _spaces(longest - command.name.length + 2) + _indentHelp(command.description, ind));
      }
    }
  }) };
//# sourceMappingURL=../sourcemaps/commands/help.js.map