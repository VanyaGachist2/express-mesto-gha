require('dotenv').config();
const { PORT = 3000 } = process.env;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');
const { validationCreateUser, validationLogin } = require('./middlewares/validation.js');
const NotFoundError = require('./errors/NotFoundError.js'); // 404
const cookieParser = require('cookie-parser');

const app = express();

const corsOption = {
  origin: ['http://localhost:3000', 'https://praktikum.tk', 'http://praktikum.tk', 'http://localhost:3001', 
  'https://vanondanon.nomoredomainsmonster.ru', 'http://vanondanon.nomoredomainsmonster.ru',
  'https://api.vanondanon.nomoredomainsmonster.ru', 'http://api.vanondanon.nomoredomainsmonster.ru'],
  credentials: true,
}

app.use(cors(corsOption));

app.use(express.json());

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use(() => {
  throw new NotFoundError('Такой страницы нет');
})

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({
    message: status === 500 ? 'Ошибка сервера' : message
  });
  next();
})


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
