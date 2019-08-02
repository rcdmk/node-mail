const config = require('./config.json');

// Environment variables override
const serverPort = process.env['PORT'];

const mailgunApiKey = process.env['MAILGUN_API_KEY'];
const sendGridApiKey = process.env['SENDGRID_API_KEY'];

if (serverPort) config.sever.port = parseInt(serverPort, 10);
if (mailgunApiKey) config.providers.mailgun.apiKey = mailgunApiKey;
if (sendGridApiKey) config.providers.sendgrid.apiKey = mailgunApiKey;

module.exports = config;
