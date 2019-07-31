'use strict';
const request = require('request-promise-native');

const errors = require('../infra/errors');
const EmailService = require('../services/email');
const {Mailgun, SendGrid} = require('../services/providers').email;

const mailgunOptions = {
  apiKey: '***REMOVED***',
  domain: 'sandbox220841877a8c45dda263ff7e5abd1f6c.mailgun.org',
  sender: 'postmaster@sandbox220841877a8c45dda263ff7e5abd1f6c.mailgun.org'
};

const sendGridOptions = {
  apiKey: '***REMOVED***',
  sender: 'test@sendgrid.com'
};

const emailOptions = {
  providers: [
    new Mailgun(request, mailgunOptions),
    new SendGrid(request, sendGridOptions),
  ]
};

const emailService = new EmailService(emailOptions);

/**
 * Returns an error response handler for a request
 *
 * @param {object} res An Express response object
 * @returns An error response handler
 */
function errorResponse(res) {
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

    res.status(statusCode)
      .send(result);
  };
}

function successResponse(res) {
  return function successResult(data) {
    if (data) {
      return res.status(200).json(data);
    }

    return res.status(204).end();
  };
}

/**
 * Handles the root index route
 */
function handleIndex(req, res) {
  res.send('API server v1.0.0');
}

/**
 * Handles sending e-mail messages
 */
function handleSendMessage(req, res) {
  const params = {
    to: req.body.to,
    cc: req.body.cc,
    bcc: req.body.bcc,
    subject: req.body.subject,
    text: req.body.text
  };

  emailService.validateAndFormatSendParams(params)
    .then((params) => emailService.send(params))
    .then(successResponse(res))
    .catch(errorResponse(res));
}

module.exports = {
  index: handleIndex,
  sendMessage: handleSendMessage,
};
