const jwt = require('jsonwebtoken');
const { JWT_CHECK } = require('../utils/config');
const InvalidTokenError = require('../errors/InvalidTokenError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new InvalidTokenError('Нужна авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_CHECK,
    );
  } catch (err) {
    throw new InvalidTokenError('Нужна авторизация');
  }

  req.user = payload;

  next();
};
