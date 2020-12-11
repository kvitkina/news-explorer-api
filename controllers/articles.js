const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send(articles))
    .catch(next);
};

const saveArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequestError('Ошибка валидации');
        next(validationError);
      } else {
        next(err);
      }
    });
};

const removeArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById(articleId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((article) => {
      if (article.owner.toString() === userId) {
        Article.findByIdAndRemove(articleId)
          .then((thisArticle) => res.send(thisArticle));
      } else {
        throw new BadRequestError('Нельзя удалять чужую карточку');
      }
    })
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

module.exports = {
  getArticles,
  saveArticle,
  removeArticle,
};
