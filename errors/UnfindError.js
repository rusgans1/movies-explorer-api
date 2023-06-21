const { UNFIND_ERROR } = require('../utils/constans');

class UnfindError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNFIND_ERROR;
  }
}

module.exports = UnfindError;
