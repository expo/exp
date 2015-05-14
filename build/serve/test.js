'use strict';

var crayon = require('@ccheever/crayon');
var PackagerController = require('./PackagerController');

var pc = new PackagerController();
pc.packagerReady.then(function () {
  crayon.blue.log('PACKAGER IS READY');
});
pc.start();
//# sourceMappingURL=../sourcemaps/serve/test.js.map