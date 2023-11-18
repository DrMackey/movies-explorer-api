const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validate');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:moviesId', validateMovieId, deleteMovie);

module.exports = router;
