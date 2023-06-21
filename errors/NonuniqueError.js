const { NONUNIQUE_ERROR } = require('../utils/constans');

class NonuniqueError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NONUNIQUE_ERROR;
  }
}

module.exports = NonuniqueError;
