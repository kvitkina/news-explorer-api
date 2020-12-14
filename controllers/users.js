const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { SOLT_ROUND } = require('../utils/configs');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConglictError = require('../errors/conflict-err');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const validationError = new BadRequestError('Не валидный id');
        next(validationError);
      }
      if (err.statusCode === 404) {
        const notFoundError = new NotFoundError('Карточка не найдена');
        next(notFoundError);
      }
      next(err);
    });
};

const register = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConglictError('Пользователь с таким email уже зарегистрирован');
      }
    });
  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send({ _id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequestError('Ошибка валидации');
        next(validationError);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => { next(err); });
};

module.exports = {
  getUserInfo,
  register,
  login,
};
