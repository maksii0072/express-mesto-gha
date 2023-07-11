const { ERROR_NOT_FOUND } = require('../utils/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
}

module.exports = NotFoundError;
