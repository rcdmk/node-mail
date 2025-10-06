"use strict";
const EmailProvider = require("./email");
const { InternalError } = require("../../infra/errors");

/**
 * Mailgun e-mail provider sends e-mails through Mailgun service
 * @class MailgunProvider
 * @extends {EmailProvider}
 */
class MailgunProvider extends EmailProvider {
  /**
   *Creates an instance of MailgunProvider.
   * @param {object} request An instance of got module
   * @param {object} options The options map for Mailgun service, like user, pass, domain and sender
   * @memberof MailgunProvider
   */
  constructor(request, options) {
    super(request);
    this.name = "Mailgun";
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
  async send(params) {
    if (!this.options.enabled)
      return Promise.reject(new InternalError("Provider not enabled"));

    try {
      const response = await this.request.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          username: "api",
          password: this.options.apiKey,
          form: {
            from: `${this.options.sender}`,
            to: params.to,
            cc: params.cc,
            bcc: params.bcc,
            subject: params.subject,
            text: params.text,
          },
          responseType: "json",
          throwHttpErrors: true,
        }
      );
      return {
        provider: this.name,
        messageId: response.body.id,
      };
    } catch (err) {
      if (err.response && err.response.body && err.response.body.error) {
        throw new InternalError(err.response.body.error);
      }
      throw err;
    }
  }
}

module.exports = MailgunProvider;
