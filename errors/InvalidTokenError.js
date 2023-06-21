const { INVALID_TOKEN_ERROR } = require('../utils/constans');

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_TOKEN_ERROR;
  }
}

module.exports = InvalidTokenError;
