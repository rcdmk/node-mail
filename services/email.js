'use strict';
const {InternalError,ValidationError} = require('../infra/errors');

const validEmailRegExp = /^[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*?\.[a-zA-Z]{2,}$/;

/**
 * E-mail service handles sending e-mail messages
 * @param  {object} options Holds options for sending messages, like providers
 * @returns {object} A configured service instance that holds a send method
 */
class EmailService{
  constructor(options) {
    if (!options) {
      throw new ValidationError('E-mail options are required');
    }

    if (!options.providers || options.providers.length === 0) {
      throw new ValidationError('It is required to specify at least one email provider');
    }

    this.options = options;
  }

  validateEmailAddress(email) {
    if (!email || email.length === 0) return false;

    return validEmailRegExp.test(email);
  }

  /**
   * Validates message params and format them to match expected standards
   * @param   {object}  params Message params, like from, to, cc, bcc, subject and text
   * @returns {Promise} A promise that resolves with the updated params or rejects with
   * validation error
   */
  validateAndFormatSendParams(params) {
    return new Promise((resolve, reject) => {
      if (!params) return reject(new ValidationError('', 'Params object missing'));

      params.to = !Array.isArray(params.to) ? [params.to] : params.to;

      if (params.cc) {
        params.cc = !Array.isArray(params.cc) ? [params.cc] : params.cc;
      }

      if (params.bcc) {
        params.bcc = !Array.isArray(params.bcc) ? [params.bcc] : params.bcc;
      }

      if (!params.to.every(this.validateEmailAddress)) {
        return reject(new ValidationError('to', 'To must be a valid e-mail address'));
      }

      if (params.cc && !params.cc.every(this.validateEmailAddress)) {
        return reject(new ValidationError('cc', 'CC must be a valid e-mail address'));
      }

      if (params.bcc && !params.bcc.every(this.validateEmailAddress)) {
        return reject(new ValidationError('bcc', 'BCC must be a valid e-mail address'));
      }

      if (!params.subject || typeof params.subject !== 'string') {
        return reject(new ValidationError('subject', 'Subject must be provided'));
      }

      if (!params.text || typeof params.text !== 'string') {
        return reject(new ValidationError('text', 'Text must be provided'));
      }

      resolve(params);
    });
  }

  /**
   * Sends an e-mail message according to the provided params. It will fallback for other providers in case one fails.
   * @param   {object}  params A set of message poperties, like to, cc, bcc, subject and text
   * @param   {number}  [currentProvider = 0] The index of the provider to be used
   * @returns {Promise} A promise that resolves when success or rejects in case of error in all providers
   */
  send(params, currentProvider = 0) {
    const providerCount = this.options.providers.length;

    if (currentProvider < 0 || currentProvider >= providerCount) {
      return Promise.reject(new InternalError('Invalid provider index'));
    }

    let provider = this.options.providers[currentProvider]; // eslint-disable-line security/detect-object-injection

    if (!provider || typeof provider.send !== 'function') {
      return Promise.reject(new InternalError('Invalid provider instance'));
    }

    return this.validateAndFormatSendParams(params)
      .then((p) => provider.send(p))
      .catch((err) => {
        // recursivelly call next provider in the list
        if (currentProvider < providerCount - 1) {
          return this.send(params, currentProvider + 1);
        }

        // all providers have failed so we fail with the last error
        throw err;
      });
  }
}

module.exports = EmailService;
