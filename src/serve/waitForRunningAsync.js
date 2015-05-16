var delayAsync = require('delay-async');

module.exports = async function (expFile) {

  var state = await expFile.getAsync('state', null);
  if (state === 'RUNNING') {
    return true;
  } else {
    await delayAsync(500);
    return module.exports(expFile);
  }

}
