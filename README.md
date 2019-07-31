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

## TODO

- [ ] Add configuration modules
- [ ] Add validation middleware to controllers
- [ ] Add Dockerfile
- [ ] Add tests for providers
- [ ] Add tests for routes
