const winston = require('winston');

// Simple logger implementation on top of Winston
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
      silent: process.argv.includes('--silent') || process.env.NODE_ENV === 'testing'
    })
  ],
  exitOnError: false
});

// stream interface for interoperability with morgan
logger.stream = {
  write: function(message) {
    logger.info(message);
  },
};

module.exports = logger;
