const jwt = require('jsonwebtoken');
const InvalidTokenError = require('../errors/InvalidTokenError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new InvalidTokenError('Нужна авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new InvalidTokenError('Нужна авторизация');
  }

  req.user = payload;

  next();
};
