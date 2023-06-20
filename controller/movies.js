const Movie = require('../models/movie');
const UnfindError = require('../errors/UnfindError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params._id)
    .orFail(() => {
      throw new UnfindError('Данные не найдены.');
    })
    .then((movie) => {
      if (movie.owner.toString() === userId) {
        Movie.findByIdAndRemove(req.params._id)
          .then((removeMovie) => {
            res.send(removeMovie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
