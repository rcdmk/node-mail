'use strict';

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
    this.app.get('/', controllers.index);
    this.app.post('/messages', controllers.sendMessage);
  }
}

module.exports = Router;
