"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const request = require("./infra/got/gotRequest");

const config = require("./config");
const logger = require("./infra/logger");
const EmailService = require("./services/email");
const { Mailgun, SendGrid } = require("./services/providers").email;
const APIController = require("./controllers");
const Router = require("./router");

// server bootstrap
const app = express();

// security middleware
app.use(cors());
app.use(helmet());

// utility middleware
app.use(logger.middleware);
app.use(bodyParser.json());

// graceful shutdown
process.on("SIGTERM", gracefulShutDown);
process.on("SIGINT", gracefulShutDown);

let shuttingDown = false;

app.use(function middleware(req, res, next) {
  if (!shuttingDown) return next();
  res.set("Connection", "close").status(503).json({
    message: "Server is restarting.",
  });
});

// routes
const emailOptions = {
  providers: [
    new Mailgun(request, config.providers.email.mailgun),
    new SendGrid(request, config.providers.email.sendgrid),
  ],
};

const emailService = new EmailService(emailOptions);
const controllers = new APIController(emailService);

new Router(app).register(controllers);

const server = app.listen(config.server.port, () => {
  const serverAddress = server.address();

  logger.info(
    `Server listening at http://${serverAddress.address}:${serverAddress.port}`
  );
});

function gracefulShutDown() {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info("Received kill signal, shutting down gracefully");

  setTimeout(function () {
    logger.warn(
      "Could not close connections in time, forcefully shutting down"
    );
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }, 10000).unref();

  server.close((err) => {
    if (err) {
      logger.error(err);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
      return;
    }

    logger.info("Closed out remaining connections");
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}
