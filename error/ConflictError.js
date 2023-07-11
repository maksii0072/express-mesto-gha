const { ERROR_CONFLICT_REQUEST } = require('../utils/errors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CONFLICT_REQUEST;
  }
}

module.exports = ConflictError;
