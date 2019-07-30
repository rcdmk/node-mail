function SendMessage(options) {
  if (!options || !options.success) {
    let err = options ? options.error : new Error();

    return Promise.reject(err);
  }

  return Promise.resolve();
}

module.exports = {
  send: SendMessage
};
