'use strict';

const validEmailRegExp = /^[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*?\.[a-zA-Z]{2,}$/;

module.exports = function EmailService(options) {
  function validateEmailAddress(email) {
    if (!email || email.length === 0) return false;

    return validEmailRegExp.test(email);
  }

  function validateAndFormatSendParams(params) {
    return new Promise((resolve, reject) => {
      if (!params) return reject(new Error('Params object missing'));

      if (!Array.isArray(params.to)) params.to = [params.to];

      if (params.cc && !Array.isArray(params.cc)) params.cc = [params.cc];
      if (params.bcc && !Array.isArray(params.bcc)) params.bcc = [params.bcc];

      if (!params.to.every(validateEmailAddress)) return reject(new Error('To must be a valid e-mail address'));
      if (!validateEmailAddress(params.from)) return reject(new Error('From must be a valid e-mail address'));

      if (params.cc && !params.cc.every(validateEmailAddress)) return reject(new Error('CC must be a valid e-mail address'));
      if (params.bcc && !params.bcc.every(validateEmailAddress)) return reject(new Error('BCC must be a valid e-mail address'));

      if (typeof params.subject !== 'string') return reject(new Error('Subject must be present, even if empty'));

      resolve(params);
    });
  }

  function send(params) {
    return new Promise((resolve, reject) => {
      validateAndFormatSendParams(params)
        .then(options.providers[0].send)
        .then(resolve)
        .catch(reject);
    });
  }

  return {
    send: send
  };
};
