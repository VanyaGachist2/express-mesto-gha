const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth.js');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const login = require('./controllers/users.js');
const createUser = require('./controllers/users.js');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/signup', createUser);
app.use('/signin', login);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
