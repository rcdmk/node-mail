'use strict';
const errors = require('../infra/errors');

class APIController {
  constructor(emailService) {
    this.emailService = emailService;
  }

  /**
   * Returns an error response handler for a request
   *
   * @param {object} res An Express response object
   * @returns An error response handler
   */
  errorResponse(res) {
    return function errorResult(err) {
      let result = {
        name: err.name,
        field: err.field,
        message: err.message,
        stack: err.stack
      };

      let statusCode = 503;

      if (err instanceof errors.ValidationError) statusCode = 422;
      if (err instanceof errors.ResourceNotFoundError) statusCode = 404;

      if (process.env['NODE_ENV'] === 'production') {
        delete result.stack;
      }

      return res.status(statusCode)
                .send(result);
    };
  }

  /**
   * Returns a success response handler for JSON format
   * @param {object} res Express response object
   * @memberof APIController
   */
  successResponse(res) {
    return function successResult(data) {
      if (data) {
        return res.status(200).json(data);
      }

      return res.status(204).end();
    };
  }

  /**
   * Handles the root index route
   * @param {object} req Express request object
   * @param {object} res Express response object
   * @memberof APIController
   */
  handleIndex(req, res) {
    return res.send('API server v1.0.0');
  }

  /**
   * Handles sending e-mail messages
   * @param {object} req Express request object
   * @param {object} res Express response object
   * @memberof APIController
   */
  handleSendMessage(req, res) {
    const params = {
      to: req.body.to,
      cc: req.body.cc,
      bcc: req.body.bcc,
      subject: req.body.subject,
      text: req.body.text
    };

    return this.emailService.validateAndFormatSendParams(params)
                            .then((params) => this.emailService.send(params))
                            .then((data) => this.successResponse(res)(data))
                            .catch((err) => this.errorResponse(res)(err));
  }
}

module.exports = APIController;
