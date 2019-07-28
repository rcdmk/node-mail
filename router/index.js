'use strict';

/**
 * Router registers controllers for each route
 * @param  {object} app Express app
 * @returns {object} register An object that holds the register method to register routes
 */
module.exports = function Router(app) {
  return {
    /**
     * Registers application routes to controller handlers
     * @param  {object} controllers The controllers module instance with handler properties
     */
    register: function registerRoutes(controllers) {
      app.get('/', controllers.Index);
    }
  };
};
