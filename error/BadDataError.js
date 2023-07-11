const { ERROR_BAD_DATA } = require('../utils/errors');

class BadDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_DATA;
  }
}

module.exports = BadDataError;
