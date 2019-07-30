const emailMailgun = require('./emailMailgun');
const emailTest = require('./emailTest');

module.exports = {
  email: {
    Mailgun: emailMailgun,
    Test: emailTest,
  }
};
