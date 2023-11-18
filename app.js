require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');
const { createUser, login } = require('./controllers/users');
const NotFound = require('./errors/notfound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const allowedCors = ['http://localhost:3000', 'http://localhost:3005'];

const app = express();

app.use(cors({ credentials: true, origin: allowedCors, maxAge: 30 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? message : message });
});

app.listen(PORT, console.log('Port:', PORT));
