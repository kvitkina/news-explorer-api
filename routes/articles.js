const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, saveArticle, removeArticle } = require('../controllers/articles');

router.get('/articles', getArticles);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required().min(2),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
    image: Joi.string().required(),
  }),
}),saveArticle);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),removeArticle);

module.exports = router;