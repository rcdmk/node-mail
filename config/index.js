const config = require('./config.json');

// Environment variables override
const serverPort = process.env['PORT'];

const mailgunApiKey = process.env['MAILGUN_API_KEY'];
const sendGridApiKey = process.env['SENDGRID_API_KEY'];

if (serverPort) config.server.port = parseInt(serverPort, 10);
if (mailgunApiKey) config.providers.email.mailgun.apiKey = mailgunApiKey;
if (sendGridApiKey) config.providers.email.sendgrid.apiKey = sendGridApiKey;

module.exports = config;
