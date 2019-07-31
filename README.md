# node-mail

This is a simple application that lets the user send e-mails through 3rd-party services using a fallback strategy when some of them fail.

## Dependencies

- Node.js v10+
- NPM 6.9+ or Yarn 1.17+

Other dependencies are listed in `package.json` file and can be downloaded with **NPM** or **Yarn**.

## Tests

This project has a test suite that covers the main logic and can be executed with:

```sh
yarn test
# or
npm test
```

## Running

To run this application, execute the following:

```sh
yarn start
# or
npm start
```

## Configuration

Configuration is stored in the config.json file, inside config module.
All keys stored there are for testing pourposes only and will not work for a production scenario. Also, that keys have no warranty and may cease to exist at any time.

> **Notice:** Besides this project stores credentials in plain text in the config file, for production use it is recommended to use environment variables or a configration service, as AWS SSM parameter store, to store the application secrets.

## Routes

### POST /v1/messages

This route enables sending e-mail messages through one of the available providers.

#### Request

```json
{
  "to": ["some@email.com"],
  "cc": ["copy@email.com"],
  "bcc": ["occult@email.com"],
  "subject": "Test e-mail subject",
  "text": "My test e-email message"
}
```

**to:** `string array` - *required* - The main recipients for the message.
**cc:** `string array` - *optional* - The carbon copy recipients for the message.
**bcc:** `string array` - *optional* - The blind carbon copy recipients for the message.
**subject:** `string array` - *required* - The message's subject line.
**text:** `string array` - *required* - The message's text body content.

#### Responses

**200:** Success

```json
{
  "provider": "provider name"
}
```

**422:** Unprocessable Entity - Validation error

```json
{
  "message": "To must be provided"
}
```

**503:** Service Unavailable - Provider and dependency errors

```json
{
  "name": "InternalError",
  "message": "Some provider error"
}
```

## TODO

- [X] Add route documentation
- [X] Add configuration modules
- [ ] Add validation middleware to controllers
- [ ] Add Dockerfile
- [ ] Add tests for providers
- [ ] Add tests for routes
