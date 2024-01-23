const Movie = require('../models/movie');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');

const CREATED = 201;

module.exports.createMovie = (req, res, next) => {
  const owner = req.user.payload;

  const { id, nameRU, nameEN, image, trailerLink, duration, likes } = req.body;

  Movie.create({
    id,
    nameRU,
    nameEN,
    image,
    trailerLink,
    duration,
    likes,
    // owner,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверно заполнены поля1'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user.payload;

  Movie.find({ likes: owner })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

// module.exports.getLikesMovies = (req, res, next) => {
//   const owner = req.user.payload;

//   Movie.find({ owner })
//     .then((movies) => res.send({ data: movies }))
//     .catch((err) => next(err));
// };

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user.payload;

  Movie.findById(req.params.moviesId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('Фильм не найден!'));
        return;
      }
      if (`"${owner}"` === JSON.stringify(movie.likes)) {
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

module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена!'));
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('неверно заполнены поля'));
        return;
      } else {
        next(err);
        return;
      }
    });
};

module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } },
    { new: true }
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card === null) {
        return next(new NotFound('Карточка не найдена'));
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('неверно заполнены поля'));
        return;
      } else {
        next(err);
        return;
      }
    });
};
