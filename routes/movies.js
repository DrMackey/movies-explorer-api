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

router.get('/movies/', getMovies);
router.post('/movies/', validateCreateMovie, createMovie);
router.delete('/movies/:moviesId', validateMovieId, deleteMovie);

module.exports = router;
