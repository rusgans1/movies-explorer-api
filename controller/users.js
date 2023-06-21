const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UnfindError = require('../errors/UnfindError');
const InvalidTokenError = require('../errors/InvalidTokenError');
const NonuniqueError = require('../errors/NonuniqueError');
const ValidationError = require('../errors/ValidationError');
const { JWT_CHECK } = require('../utils/config');
const {
  NONUNIQUE_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  INVALID_TOKEN_ERROR_MESSAGE,
  UNFIND_ERROR_MESSAGE,
  TOKEN_CREATE_MESSAGE,
  LOGOUT_MESSAGE,
} = require('../utils/constans');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      { email, password: hash, name },
    ))
    .then((user) => res.send({
      email: user.email, name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new NonuniqueError(NONUNIQUE_ERROR_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidTokenError(INVALID_TOKEN_ERROR_MESSAGE);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new InvalidTokenError(INVALID_TOKEN_ERROR_MESSAGE);
          }

          const token = jwt.sign({ _id: user.id }, JWT_CHECK, { expiresIn: '7d' });
          return res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }).send(TOKEN_CREATE_MESSAGE);
        });
    })
    .catch(next);
};

const getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new UnfindError(UNFIND_ERROR_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch(next);
};

const changeInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UnfindError(UNFIND_ERROR_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new NonuniqueError(NONUNIQUE_ERROR_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

const signOutUser = (req, res) => {
  res.clearCookie('jwt', {
    sameSite: 'none',
    secure: true,
  }).send(LOGOUT_MESSAGE);
};

module.exports = {
  createUser, loginUser, getInfo, changeInfo, signOutUser,
};
