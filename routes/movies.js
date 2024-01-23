const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
  likeMovie,
  dislikeMovie,
  // getLikesMovies,
} = require('../controllers/movies');
const {
  // validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validate');

router.get('/movies/', getMovies);
// router.get('/movies/likes', getLikesMovies);
router.post('/movies/', createMovie);
router.delete('/movies/:moviesId', validateMovieId, deleteMovie);
router.put('/:cardId/likes', likeMovie);
router.delete('/:cardId/likes', dislikeMovie);

module.exports = router;
