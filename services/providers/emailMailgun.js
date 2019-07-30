'use strict';
const EmailProvider = require('./email');


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
    this.options = options;
  }

  /**
   * Sends an e-mail message according to provided parameters
   * @param {object} params Message parameters like to, cc, bcc, subject and text
   * @returns
   * @memberof MailgunProvider
   */
  send(params) {
    const opts = {
      method: 'POST',
      uri: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      auth: {
        user: this.options.user,
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
      .then((data) => {
        return {
          messageId: data.id
        };
      });
  }
}

module.exports = MailgunProvider;
