const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');
const { validationCreateUser, validationLogin } = require('./middlewares/validation.js');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
