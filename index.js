'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const request = require('request-promise-native');

const EmailService = require('./services/email');
const {Mailgun, SendGrid} = require('./services/providers').email;

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


const APIController = require('./controllers');
const Router = require('./router');

const app = express();

// security middleware
app.use(cors());
app.use(helmet());

app.use(morgan('common'));
app.use(bodyParser.json());

const controllers = new APIController(emailService);
new Router(app).register(controllers);

const server = app.listen(3000, () => {
  const serverAddress = server.address();

  console.log(`Server listening at http://${serverAddress.address}:${serverAddress.port}`);
});
