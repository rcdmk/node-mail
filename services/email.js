'use strict';

const validEmailRegExp = /^(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateEmailAddress(email) {
  if (!email || email.length === 0) return false;

  return validEmailRegExp.test(email);
}

module.exports = function EmailService(options) {
  return {
    send: function(params) {
      return new Promise((resolve, reject) => {
        if (!params) return reject(new Error('Params object missing'));

        if (!validateEmailAddress(params.to)) return reject(new Error('To must be a valid e-mail address'));
        if (!validateEmailAddress(params.from)) return reject(new Error('From must be a valid e-mail address'));

        resolve();
      });
    }
  };
};
