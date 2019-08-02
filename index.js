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
