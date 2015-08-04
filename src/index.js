for (let x of [
  'api',
  'argv',
  'askUser',
  'config',
  'exp',
  'log',
  'password',
  'session',
  'simulator',
  'update',
  'urlUtil',
  'userSettings',
]) {
  module.exports[x] = require('./' + x);
}

for (let x of [
  'PackagerController',
  'serveAsync',
  'waitForRunningAsync',
]) {
  module.exports[x] = require('./serve/' + x);
}
