function SendMessage() {
  // always succeeds
  return Promise.resolve();
}

module.exports = {
  send: SendMessage
};
