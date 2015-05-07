module.exports = function(ms) {
  return new Promise((fulfill, reject) => {
    setTimeout(fulfill, ms);
  });
}
