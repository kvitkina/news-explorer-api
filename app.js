const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/newsdb' } = process.env;
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { limiter } = require('./utils/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // логгер запросов
app.use('/', router); // обработчик роутов
app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(limiter);
app.use((err, req, res, next) => { // централизованный обработчик ошибок
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
