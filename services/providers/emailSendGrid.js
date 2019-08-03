'use strict';
const EmailProvider = require('./email');
const {InternalError} = require('../../infra/errors');

/**
 * SendGrid e-mail provider sends e-mails through SendGrid service
 * @class SendGridProvider
 * @extends {EmailProvider}
 */
class SendGridProvider extends EmailProvider {
  /**
   *Creates an instance of SendGridProvider.
   * @param {object} request An instance of request-promised module
   * @param {object} options The options map for SendGrid service, like user, pass, domain and sender
   * @memberof SendGridProvider
   */
  constructor(request, options) {
    super(request);
    this.name = 'SendGrid';
    this.options = options;
  }

  /**
   * Sends an e-mail message according to provided parameters
   * @param {object} params Message parameters like to, cc, bcc, subject and text
   * @returns
   * @memberof SendGridProvider
   */
  send(params) {
    const recipients = {
      to: params.to.map((email) => {
        return {email: email};
      }),
    };

    if (params.cc) {
      recipients.cc = params.cc.map((email) => {
        return {email: email};
      });
    }

    if (params.cc) {
        recipients.bcc = params.bcc.map((email) => {
        return {email: email};
      });
    }

    const opts = {
      method: 'POST',
      uri: 'https://api.sendgrid.com/v3/mail/send',
      simple: true,
      auth: {
        bearer: this.options.apiKey
      },
      body: {
        personalizations: [
          recipients
        ],
        from: {
          email: this.options.sender
        },
        subject: params.subject,
        content: [
          {
            type: 'text/plain',
            value: params.text
          }
        ]
      },
      json: true // Automatically parses the JSON string in the response
    };

    return super.send(opts)
    .catch((err) => {
      if (err.data && err.data.error && err.data.error.errors) {
        throw new InternalError(err.data.error.errors[0]);
      }

      throw err;
    })
    .then((data) => {
        return {
          provider: this.name,
          data
        };
      });
  }
}

module.exports = SendGridProvider;
