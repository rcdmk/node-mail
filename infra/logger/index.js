const winston = require('winston');
const expressWinston = require('express-winston');

// Simple Winston logger for console output
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      handleExceptions: true,
      json: true,
      colorize: false,
      silent: process.argv.includes('--silent') || process.env.NODE_ENV === 'testing'
    })
  ],
  exitOnError: false
});

// Express middleware for logging requests
logger.middleware = expressWinston.logger({
  winstonInstance: logger,
  meta: true, // log the meta data about the request
  expressFormat: true, // Use the default Express/morgan request formatting.
  colorize: false
});

module.exports = logger;
