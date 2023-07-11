const { ERROR_UNAUTHORIZED } = require('../utils/errors');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
