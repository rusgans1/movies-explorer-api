const router = require('express').Router();
const { idValidation, createMovieValidation } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controller/movies');

router.get('/movies', getMovies);

router.post('/movies', createMovieValidation, createMovie);

router.delete('/movies/:_id', idValidation, deleteMovie);

module.exports = router;
