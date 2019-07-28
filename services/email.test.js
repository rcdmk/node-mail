const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const emailServiceModule = require('./email');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('E-mail service', function() {
  describe('#send()', function() {
    let emailService;
    const emailServiceOptions = {};
    let messageOptions;

    beforeEach(function() {
      emailService = emailServiceModule(emailServiceOptions);
      messageOptions = {
        from: 'me@domain.com',
        to: 'destination@another.com',
        subject: 'Test e-mail',
        body: 'Just testing'
      };
    });

    it('Should return an error if no sender is present', function(done) {
      delete messageOptions.from;

      expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
    });

    it('Should return an error if no primary destination is present', function(done) {
      delete messageOptions.to;

      expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
    });

    it('Should NOT return an error if all required parameter are specified', function(done) {
      expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
    });
  });
});
