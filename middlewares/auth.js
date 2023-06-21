const jwt = require('jsonwebtoken');
const { JWT_CHECK } = require('../utils/config');
const InvalidTokenError = require('../errors/InvalidTokenError');
const { INVALID_TOKEN_ERROR_MESSAGE } = require('../utils/constans');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new InvalidTokenError(INVALID_TOKEN_ERROR_MESSAGE);
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_CHECK,
    );
  } catch (err) {
    throw new InvalidTokenError(INVALID_TOKEN_ERROR_MESSAGE);
  }

  req.user = payload;

  next();
};
