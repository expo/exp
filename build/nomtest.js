'use strict';

var nomnom = require('nomnom');

nomnom.options({
   debug: {
      abbr: 'd',
      flag: true,
      help: 'Print debugging info'
   },
   fruit: {
      help: 'Fruit to buy'
   } }).options({
   ryan: {
      abbr: 'r',
      flag: true,
      help: 'Adams' } }).nocolors().script('nomtest');

nomnom.parse();
//# sourceMappingURL=sourcemaps/nomtest.js.map