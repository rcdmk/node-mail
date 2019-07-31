'use strict';
const {Router:expressRouter} = require('express');

/**
 * Router registers controllers for each route
 * @param  {object} app Express app
 */
class Router {
  constructor(app) {
    this.app = app;
  }

  /**
   * Registers application routes to controller handlers
   * @param  {object} controllers The controllers module instance with handler properties
   */
  register(controllers) {
    this.app.get('/', (req, res) => controllers.handleIndex(req, res));

    const versionGroup = expressRouter('/v1');

    versionGroup.post('/messages', (req, res) => controllers.handleSendMessage(req, res));

    this.app.use(versionGroup);

    // Not found
    this.app.use((req, res, next) => {
      res.status(404)
        .send({
          message: `Route '${req.method} ${req.url}' not found.`
        });

      return next();
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      res.status(500)
        .send({
          name: err.name,
          message: err.message,
          stack: process.env['NODE_ENV'] !== 'production' ? err.stack : undefined
        });

      return next();
    });
  }
}

module.exports = Router;
