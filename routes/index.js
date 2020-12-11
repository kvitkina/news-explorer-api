const router = require('express').Router();
const articlesRoutes = require('./articles');
const usersRoutes = require('./users');
const NotFoundError = require('../errors/not-found-err');

router.use('/', usersRoutes);
router.use('/', articlesRoutes);
router.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;