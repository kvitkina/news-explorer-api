const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const articlesRoutes = require('./articles');
const usersRoutes = require('./users');
const NotFoundError = require('../errors/not-found-err');
const { register, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

// обработчики роутов
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth); // защита роутов
router.use('/', usersRoutes);
router.use('/', articlesRoutes);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
