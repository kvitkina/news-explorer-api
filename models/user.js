const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/not-found-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле "name" должно быть заполнено'],
    minlength: [2, 'минимальная длина поля "name" - 2'],
    maxlength: [30, 'максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    required: [true, 'поле "email" должно быть заполнено'],
    unique: [true, 'такой email уже зарегистрирован'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'поле "password" должно быть заполнено'],
    minlength: [8, 'минимальная длина пароля - 8'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotFoundError('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
