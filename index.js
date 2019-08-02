'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const request = require('request-promise-native');

const config = require('./config');
const EmailService = require('./services/email');
const {Mailgun, SendGrid} = require('./services/providers').email;
const APIController = require('./controllers');
const Router = require('./router');


// server bootstrap
const app = express();

// security middleware
app.use(cors());
app.use(helmet());

// utility middleware
app.use(morgan('common'));
app.use(bodyParser.json());

// graceful shutdown
process.on('SIGTERM', gracefulShutDown);
process.on('SIGINT', gracefulShutDown);

let shuttingDown = false;

app.use(function middleware(req, res, next) {
  if (!shuttingDown) return next();
  res.set('Connection', 'close')
    .status(503)
    .json({
      message: 'Server is restarting.'
    });
});

// routes
const emailOptions = {
  providers: [
    new Mailgun(request, config.providers.email.mailgun),
    new SendGrid(request, config.providers.email.sendgrid),
  ]
};

const emailService = new EmailService(emailOptions);
const controllers = new APIController(emailService);

new Router(app).register(controllers);

const server = app.listen(config.server.port, () => {
  const serverAddress = server.address();

  console.log(`Server listening at http://${serverAddress.address}:${serverAddress.port}`);
});

function gracefulShutDown() {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log('Received kill signal, shutting down gracefully');

  setTimeout(function () {
    console.log('Could not close connections in time, forcefully shutting down');
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }, 10000).unref();

  server.close((err) => {
      if (err) {
        console.error(err);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
        return;
      }

      console.log('Closed out remaining connections');
      // eslint-disable-next-line no-process-exit
      process.exit(0);
  });
}
