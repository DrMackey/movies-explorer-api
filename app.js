require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');

const NotFound = require('./errors/notfound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, dataMovies = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;
const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3005',
  'http://drmackey.nomoredomainsmonster.ru',
  'http://api.drmackey.nomoredomainsmonster.ru',
  'https://drmackey.nomoredomainsmonster.ru',
  'https://api.drmackey.nomoredomainsmonster.ru',
];
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();

app.use(limiter);
app.use(cors({ credentials: true, origin: allowedCors, maxAge: 30 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

mongoose.connect(dataMovies);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/auth'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? message : message });

  next();
});

app.listen(PORT);
