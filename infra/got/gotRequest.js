// gotRequest.js
// Adapter to use got with the EmailProvider interface
const got = require("got");

module.exports = function gotRequest(options) {
  // Map request-promise options to got
  const gotOptions = {
    method: options.method,
    url: options.uri,
    responseType: options.json ? "json" : "text",
    throwHttpErrors: options.simple !== false,
    username: options.auth && options.auth.user,
    password: options.auth && options.auth.pass,
    headers: {},
    form: options.form,
    json: options.body,
  };

  if (options.auth && options.auth.bearer) {
    gotOptions.headers.Authorization = `Bearer ${options.auth.bearer}`;
  }

  // Remove undefined fields
  Object.keys(gotOptions).forEach(
    (k) => gotOptions[k] === undefined && delete gotOptions[k]
  );

  return got(gotOptions.url, gotOptions)
    .then((response) => {
      // got v12+ returns response.body
      return response.body;
    })
    .catch((err) => {
      // Map got error to request-promise-like error
      throw {
        error:
          err.response && err.response.body ? err.response.body : err.message,
        data: err.response && err.response.body,
        statusCode: err.response && err.response.statusCode,
      };
    });
};
