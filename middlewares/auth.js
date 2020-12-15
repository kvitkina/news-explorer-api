const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  const token = authorization.replace('Bearer ', ''); // извлечём токен
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next();
};
