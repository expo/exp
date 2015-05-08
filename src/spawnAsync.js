var child_process = require('child_process');

module.exports = function (...args) {
  var child = child_process.spawn(...args);
  var p = new Promise((fulfill, reject) => {
    child.on('close', function (code) {
      if (code) {
        reject(new Error("Process exited with non-zero code: " + code));
      } else {
        fulfill(0);
      }
    });
  });
  p.child = child;
  return p;
};
