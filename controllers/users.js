require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/badrequest');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');

const CREATED = 201;
const { NODE_ENV, JWT_SECRET } = process.env;

let token = '';

function getJwtToken(id) {
  token = jwt.sign(
    { payload: id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );
  return token;
}

module.exports.getUser = (req, res, next) => {
  User.findById(req.user.payload)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(CREATED).send({
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Неверно заполнены поля'));
          } else if (err.code === 11000) {
            next(new Conflict('Пользователь уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => next(err));
};

module.exports.patchMe = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user.payload,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверно заполнены поля'));
      } else if (err.code === 11000) {
        next(new Conflict('Этот адрес уже используется'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль'));
        return;
      }
      token = getJwtToken(user._id);

      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          next(new Unauthorized('Неправильные почта или пароль'));
          return;
        }

        res
          .cookie('jwt', token, {
            maxage: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .send({ message: 'Успешная авторизация.' });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCookie = (req, res, next) => {
  res.clearCookie('jwt').send({ message: 'Успешное удаление куки.' });
  next();
};
