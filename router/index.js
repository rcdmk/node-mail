'use strict';
const {Router:expressRouter} = require('express');

/**
 * Router registers controllers for each route
 */
class Router {
  /**
   * Creates an instance of Router.
   * @param  {object} app Express app
   * @memberof Router
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * 404 error handler
   * @param {object}    req Express request object
   * @param {object}    res Express response object
   * @param {function}  next Express next callback
   * @memberof Router
   */
  handle404Errors(req, res, next) {
    res.status(404)
      .send({
        message: `Route '${req.method} ${req.url}' not found.`
      });

    return next();
  }

  /**
   * 5XX error handler
   * @param {Error}     err The error result
   * @param {object}    req Express request object
   * @param {object}    res Express response object
   * @param {function}  next Express next callback
   * @memberof Router
   */
  handle500Errors(err, req, res, next) {
    res.status(500)
      .send({
        name: err.name,
        message: err.message,
        stack: process.env['NODE_ENV'] !== 'production' ? err.stack : undefined
      });

    return next();
  }

  /**
   * Registers application routes to controller handlers
   * @param  {object} controllers The controllers module instance with handler properties
   */
  register(controllers) {
    // Root
    this.app.get('/', (req, res) => controllers.handleIndex(req, res));

    // V1
    const version1Group = expressRouter();

    version1Group.post('/messages', (req, res) => controllers.handleSendMessage(req, res));

    this.app.use('/v1', version1Group);

    // Not found
    this.app.use(this.handle404Errors);

    // Error handler
    this.app.use(this.handle500Errors);
  }
}

module.exports = Router;
