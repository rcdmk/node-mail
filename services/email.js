'use strict';

module.exports = function EmailService(options) {
  return {
    send: function(params) {
      return new Promise((resolve, reject) => {
        if (!params) return reject(new Error('Params object missing'));

        if (!params.from) return reject(new Error('From address is required'));

        if (!params.to) return reject(new Error('To address is required'));

        resolve();
      });
    }
  };
};
