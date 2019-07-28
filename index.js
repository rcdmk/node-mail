'use strict';

const express = require('express');
const controllers = require('./controllers');
const router = require('./router');

const app = express();

router(app).register(controllers);

const server = app.listen(3000, () => {
  const serverAddress = server.address();

  console.log(`Server listening at http://${serverAddress.address}:${serverAddress.port}`);
});
