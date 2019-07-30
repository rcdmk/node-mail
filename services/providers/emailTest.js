'use strict';
const EmailProvider = require('./email');

/**
 * Emulates a message sending provider that always succeeds of fails
 * @param   {object}  options Service params, as success and error
 */
class TestProvider extends EmailProvider {
  constructor(options) {
    super(null);
    this.options = options;
  }

  send() {
    if (!this.options || !this.options.success) {
      let err = this.options && this.options.error ? this.options.error : new Error('E-mail provider error');

      return Promise.reject(err);
    }

    return Promise.resolve();
  }
}

module.exports = TestProvider;
