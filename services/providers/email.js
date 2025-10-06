const { InternalError } = require("../../infra/errors");

/**
 * Base e-mail service provider class
 * @class EmailProvider
 */
class EmailProvider {
  /**
   * Creates an instance of EmailProvider.
   * @param {object} request A got instance to call HTTP endpoints
   * @memberof EmailProvider
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Calls the request to send messages with provided request parameters
   *
   * @param {object} params got parameters object
   * @returns {Promise} A resolved promise with null result on success,
   * a rejected promise with the error cause otherwise
   * @memberof EmailProvider
   */
  send(params) {
    return this.request(params).catch((err) => {
      throw new InternalError(err.error);
    });
  }
}

module.exports = EmailProvider;
