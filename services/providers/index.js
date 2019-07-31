const emailMailgun = require('./emailMailgun');
const emailSendGrid = require('./emailSendGrid');
const emailTest = require('./emailTest');

module.exports = {
  email: {
    Mailgun: emailMailgun,
    SendGrid: emailSendGrid,
    Test: emailTest,
  }
};
