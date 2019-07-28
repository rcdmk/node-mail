/**
 * Handles the root index route
 * @param  {object} req HTTP request object
 * @param  {object} res HTTP response object
 */
function handleIndex(req, res) {
  res.send('OK');
}

module.exports = {
  Index: handleIndex
};
