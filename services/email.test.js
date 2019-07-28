'use strict';

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

    it('Should NOT return an error if all required parameters are specified and valid', function(done) {
      expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
    });

    describe('FROM:', function() {
      it('Should return an error if no sender address is present', function(done) {
        delete messageOptions.from;

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if sender address is not a string or array of strings', function(done) {
        messageOptions.from = {'email':'test@domain.com'};

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if sender address is not a valid e-mail address', function(done) {
        messageOptions.from = 'someone-at-domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });
    });

    describe('TO:', function() {
      it('Should return an error if no primary destination is present', function(done) {
        delete messageOptions.to;

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if primary destination is not a valid e-mail address', function(done) {
        messageOptions.to = 'someone-at-domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if primary destination address is not a string or array of strings', function(done) {
        messageOptions.to = {'email':'test@domain.com'};

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if primary destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.to = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should NOT return an error if primary destination is an array of valid e-mail addresses', function(done) {
        messageOptions.to = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
      });
    });

    describe('CC:', function() {
      it('Should return an error if CC destination is an invalid e-mail addresses', function(done) {
        messageOptions.cc = 'address1-at-domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if CC destination address is not a string or array of strings', function(done) {
        messageOptions.cc = {'email':'test@domain.com'};

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should NOT return an error if CC destination is a valid e-mail addresses', function(done) {
        messageOptions.cc = 'address1@domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
      });

      it('Should return an error if CC destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.cc = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should NOT return an error if CC destination is an array of valid e-mail addresses', function(done) {
        messageOptions.cc = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
      });
    });

    describe('BCC:', function() {
      it('Should return an error if BCC destination is an invalid e-mail addresses', function(done) {
        messageOptions.bcc = 'address1-at-domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should return an error if BCC destination address is not a string or array of strings', function(done) {
        messageOptions.bcc = {'email':'test@domain.com'};

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should NOT return an error if BCC destination is a valid e-mail addresses', function(done) {
        messageOptions.bcc = 'address1@domain.com';

        expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
      });

      it('Should return an error if BCC destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.bcc = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.rejected.and.notify(done);
      });

      it('Should NOT return an error if BCC destination is an array of valid e-mail addresses', function(done) {
        messageOptions.bcc = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.send(messageOptions)).to.eventually.be.fulfilled.and.notify(done);
      });
    });
  });
});
