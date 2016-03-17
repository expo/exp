module.exports = function CommandError(code, env, message) {
  var err = new Error(message);
  err.code = code;
  err._isCommandError = true;
  err.env = env;
  return err;
}

module.exports.isCommandError = function (err) {
  return (err && !!err._isCommandError);
};
