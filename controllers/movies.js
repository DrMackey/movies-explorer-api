const Movie = require('../models/movie');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');

const CREATED = 201;

module.exports.createMovie = (req, res, next) => {
  const owner = req.user.payload;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверно заполнены поля'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user.payload;

  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user.payload;

  Movie.findById(req.params.moviesId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('Фильм не найден!'));
        return;
      }
      if (`"${owner}"` === JSON.stringify(movie.owner)) {
        movie
          .deleteOne()
          .then(() => {
            res.send({ data: movie });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        next(new Forbidden('Отказано в доступе'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный id'));
      } else {
        next(err);
      }
    });
};
