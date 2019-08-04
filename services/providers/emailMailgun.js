'use strict';
const EmailProvider = require('./email');
const {InternalError} = require('../../infra/errors');

/**
 * Mailgun e-mail provider sends e-mails through Mailgun service
 * @class MailgunProvider
 * @extends {EmailProvider}
 */
class MailgunProvider extends EmailProvider {
  /**
   *Creates an instance of MailgunProvider.
   * @param {object} request An instance of request-promised module
   * @param {object} options The options map for Mailgun service, like user, pass, domain and sender
   * @memberof MailgunProvider
   */
  constructor(request, options) {
    super(request);
    this.name = 'Mailgun';
    this.options = options;
  }

  get enabled() {
    return this.options.enabled;
  }

  /**
   * Sends an e-mail message according to provided parameters
   * @param {object} params Message parameters like to, cc, bcc, subject and text
   * @returns
   * @memberof MailgunProvider
   */
  send(params) {
    if (!this.options.enabled) return Promise.reject(new InternalError('Provider not enabled'));

    const opts = {
      method: 'POST',
      uri: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      simple: true,
      auth: {
        user: 'api',
        pass: this.options.apiKey
      },
      form: {
        from: `${this.options.sender}`,
        to: params.to,
        cc: params.cc,
        bcc: params.bcc,
        subject: params.subject,
        text: params.text
      },
      json: true // Automatically parses the JSON string in the response
    };

    return super.send(opts)
      .catch((err) => {
        if (err.data && err.data.error) throw new InternalError(err.data.error);

        throw err;
      })
      .then((data) => {
        return {
          provider: this.name,
          messageId: data.id
        };
      });
  }
}

module.exports = MailgunProvider;
