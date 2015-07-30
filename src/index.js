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
