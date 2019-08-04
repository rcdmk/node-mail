# node-mail

This is a simple application that lets the user send e-mails through 3rd-party services using a fallback strategy when some of them fail.

## Table of contents

- [node-mail](#node-mail)
  - [Table of contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Tests](#tests)
  - [Running](#running)
  - [Configuration](#configuration)
  - [Routes](#routes)
    - [POST /v1/messages](#post-v1messages)
      - [Request](#request)
      - [Responses](#responses)
  - [TODO](#todo)

## Dependencies

- Node.js v10+
- NPM 6.9+ or Yarn 1.17+

Other dependencies are listed in `package.json` file and can be downloaded with **NPM** or **Yarn** from the repository root with:

```sh
yarn install
# or
npm install
```

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

To run this on Docker, execute the following:

```sh
# build docker image (first time only)
docker build -t node-mail:latest .

# run container
docker run -p 3000:3000 node-mail:latest
```

## Configuration

Configuration is stored in the config.json file, inside config module and some of its values can be overridden by environment variables:

|       # | Parameter | Type    | Description                                      | Env Var Override |
| ------: | :-------- | :------ | :----------------------------------------------- | :--------------- |
|       1 | server    | object  | Server config section                            |                  |
|     1.1 | port      | integer | Server port to listen to                         | PORT             |
|       2 | providers | object  | Providers config section                         |                  |
|     2.1 | email     | object  | E-mail providers config                          |                  |
|   2.1.1 | mailgun   | object  | Mailgun e-mail provider config                   |                  |
| 2.1.1.1 | enabled   | boolean | Flag to enable provider                          |                  |
| 2.1.1.2 | apiKey    | string  | Mailgun API key                                  | MAILGUN_API_KEY  |
| 2.1.1.3 | domain    | string  | Domain configured in Mailgun                     |                  |
| 2.1.1.4 | sender    | string  | Sender address for Mailgun (must be from domain) |                  |
|   2.1.2 | sendgrid  | object  | SendGrid e-mail provider config                  |                  |
| 2.1.2.1 | enabled   | boolean | Flag to enable provider                          |                  |
| 2.1.2.2 | apiKey    | string  | SendGrid API key                                 | SENDGRID_API_KEY |
| 2.1.2.3 | sender    | string  | Sender address for  SendGrid                     |                  |

> **Notice:** Besides this project may store credentials in plain text in the config file, for production use it is recommended to use environment variable overrides or a configration service, as AWS SSM parameter store, to store the application secrets.

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

|    # | Property | Type         | Required | Description                                   | Default |
| ---: | :------- | :----------- | :------- | :-------------------------------------------- | :------ |
|    1 | to       | string array | required | Main message recipients                       | empty   |
|    2 | cc       | string array | optional | Secondary message recipients (Carbon Copy)    | empty   |
|    3 | bcc      | string array | optional | Hidden message recipients (Blind Carbon Copy) | empty   |
|    4 | subject  | string       | required | Message subject                               | empty   |
|    5 | text     | string       | required | Message text body                             | empty   |

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
- [X] Add app logger
- [X] Add graceful shutdown
- [ ] Add validation middleware to controllers
- [X] Add Dockerfile
- [ ] Add tests for providers
- [ ] Add tests for routes
