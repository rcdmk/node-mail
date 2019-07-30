'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const EmailService = require('./email');
const TestEmailProvider = require('./providers').email.Test;
const {InternalError, ValidationError} = require('../infra/errors');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('E-mail service', function() {
  let emailService, emailServiceOptions, messageOptions;

  const successfulEmailProvider = new TestEmailProvider({success: true});
  const failedEmailProvider = new TestEmailProvider({
    success: false,
    error: new InternalError('Some service error')
  });

  beforeEach(function() {
    emailServiceOptions = {
      providers: [successfulEmailProvider]
    };

    emailService = new EmailService(emailServiceOptions);

    messageOptions = {
      from: 'me@domain.com',
      to: 'destination@another.com',
      subject: 'Test e-mail',
      text: 'Just testing'
    };
  });

  describe('#validateAndFormatSendParams()', function() {
    it('Should return an error if parameters are not specified', function(done) {
      expect(emailService.validateAndFormatSendParams())
				.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
    });

    it('Should NOT return an error if all required parameters are specified and valid', function(done) {
      expect(emailService.validateAndFormatSendParams(messageOptions))
				.to.eventually.be.fulfilled.and.notify(done);
    });

    describe('TO:', function() {
      it('Should return an error if no primary destination is present', function(done) {
        delete messageOptions.to;

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if primary destination is not a valid e-mail address', function(done) {
        messageOptions.to = 'someone-at-domain.com';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if primary destination address is not a string or array of strings', function(done) {
        messageOptions.to = {'email':'test@domain.com'};

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if primary destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.to = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should NOT return an error if primary destination is an array of valid e-mail addresses', function(done) {
        messageOptions.to = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.fulfilled.and.notify(done);
      });
    });

    describe('CC:', function() {
      it('Should return an error if CC destination is an invalid e-mail addresses', function(done) {
        messageOptions.cc = 'address1-at-domain.com';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if CC destination address is not a string or array of strings', function(done) {
        messageOptions.cc = {'email':'test@domain.com'};

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should NOT return an error if CC destination is a valid e-mail addresses', function(done) {
        messageOptions.cc = 'address1@domain.com';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.fulfilled.and.notify(done);
      });

      it('Should return an error if CC destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.cc = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should NOT return an error if CC destination is an array of valid e-mail addresses', function(done) {
        messageOptions.cc = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.fulfilled.and.notify(done);
      });
    });

    describe('BCC:', function() {
      it('Should return an error if BCC destination is an invalid e-mail addresses', function(done) {
        messageOptions.bcc = 'address1-at-domain.com';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if BCC destination address is not a string or array of strings', function(done) {
        messageOptions.bcc = {'email':'test@domain.com'};

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should NOT return an error if BCC destination is a valid e-mail addresses', function(done) {
        messageOptions.bcc = 'address1@domain.com';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.fulfilled.and.notify(done);
      });

      it('Should return an error if BCC destination is an array that contains invalid e-mail addresses', function(done) {
        messageOptions.bcc = ['address1@domain.com', 'address2-at-domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should NOT return an error if BCC destination is an array of valid e-mail addresses', function(done) {
        messageOptions.bcc = ['address1@domain.com', 'address2@domain.com'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.fulfilled.and.notify(done);
      });
    });

    describe('Subject:', function() {
      it('Should return an error if subject is not present', function(done) {
        delete messageOptions.subject;

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if subject is not a string', function(done) {
        messageOptions.subject = ['Some subject'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if subject is empty', function(done) {
        messageOptions.subject = '';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });
    });

    describe('Text:', function() {
      it('Should return an error if text is not present', function(done) {
        delete messageOptions.text;

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if text is not a string', function(done) {
        messageOptions.text = ['Some subject'];

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });

      it('Should return an error if text is empty', function(done) {
        messageOptions.text = '';

        expect(emailService.validateAndFormatSendParams(messageOptions))
					.to.eventually.be.rejectedWith(ValidationError).and.notify(done);
      });
    });
  });

  describe('#send()', function() {
    it('Should NOT return an error with single provider if provider returns success', function(done) {
      emailServiceOptions.providers = [successfulEmailProvider];
      emailService = new EmailService(emailServiceOptions);

      expect(emailService.send(messageOptions))
				.to.eventually.be.fulfilled.and.notify(done);
    });

    it('Should return an error with a single provider if provider returns an error', function(done) {
      emailServiceOptions.providers = [failedEmailProvider];
      emailService = new EmailService(emailServiceOptions);

      expect(emailService.send(messageOptions))
				.to.eventually.be.rejectedWith(InternalError).and.notify(done);
    });

    it('Should return an error with multiple providers if all providers return error', function(done) {
      emailServiceOptions.providers = [failedEmailProvider, failedEmailProvider];
      emailService = new EmailService(emailServiceOptions);

      expect(emailService.send(messageOptions))
				.to.eventually.be.rejectedWith(InternalError).and.notify(done);
    });

    it('Should NOT return an error with multiple providers if one provider returns success', function(done) {
      emailServiceOptions.providers = [failedEmailProvider, successfulEmailProvider];
      emailService = new EmailService(emailServiceOptions);

      expect(emailService.send(messageOptions))
				.to.eventually.be.fulfilled.and.notify(done);
    });
  });
});
