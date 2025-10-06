"use strict";
const EmailProvider = require("./email");
const { InternalError } = require("../../infra/errors");

/**
 * SendGrid e-mail provider sends e-mails through SendGrid service
 * @class SendGridProvider
 * @extends {EmailProvider}
 */
class SendGridProvider extends EmailProvider {
  /**
   *Creates an instance of SendGridProvider.
   * @param {object} request An instance of got module
   * @param {object} options The options map for SendGrid service, like user, pass, domain and sender
   * @memberof SendGridProvider
   */
  constructor(request, options) {
    super(request);
    this.name = "SendGrid";
    this.options = options;
  }

  get enabled() {
    return this.options.enabled;
  }

  /**
   * Sends an e-mail message according to provided parameters
   * @param {object} params Message parameters like to, cc, bcc, subject and text
   * @returns
   * @memberof SendGridProvider
   */
  async send(params) {
    if (!this.options.enabled)
      return Promise.reject(new InternalError("Provider not enabled"));

    const recipients = {
      to: params.to.map((email) => ({ email })),
    };
    if (params.cc) {
      recipients.cc = params.cc.map((email) => ({ email }));
    }
    if (params.bcc) {
      recipients.bcc = params.bcc.map((email) => ({ email }));
    }

    try {
      const response = await this.request.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          headers: {
            Authorization: `Bearer ${this.options.apiKey}`,
          },
          json: {
            personalizations: [recipients],
            from: { email: this.options.sender },
            subject: params.subject,
            content: [
              {
                type: "text/plain",
                value: params.text,
              },
            ],
          },
          responseType: "json",
          throwHttpErrors: true,
        }
      );
      return {
        provider: this.name,
        data: response.body,
      };
    } catch (err) {
      if (
        err.response &&
        err.response.body &&
        err.response.body.errors &&
        err.response.body.errors[0]
      ) {
        throw new InternalError(err.response.body.errors[0]);
      }
      throw err;
    }
  }
}

module.exports = SendGridProvider;
