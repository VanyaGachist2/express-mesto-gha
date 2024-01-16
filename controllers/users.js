const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError.js'); // 404
const BadRequestError = require('../errors/BadRequestError.js'); // 400
const ConflictError = require('../errors/ConflictError.js'); // 409
const AuthError = require('../errors/AuthError.js'); // 401


module.exports.getUser = async(req, res) => { // +
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports.getOneUser = async(req, res) => { // ++
  try {
    const user = await User.findById(req.user._id);
    if(!user) {
      throw new NotFoundError('такого пользователя нет');
    }
    const { _id, name, about, avatar, email } = user;
    return res.status(200).json({ _id, name, about, avatar, email });
  } catch(err) {
    if(err.name === 'CastError') {
      throw new BadRequestError('неккоректный id');
    }
    return res.status(500).json({ message: err.message })
  }
}

module.exports.getUserById = async(req, res) => { // +
  try {
    const users = await User.findById(req.params.userId);
    if (!users) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json(users);
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Некорректный id');
    }
    return res.status(500).json({ message: err.message });
  }
}

module.exports.createUser = async(req, res, next) => { // +
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
      .then(() => {
        return res.status(201).json({ name, about, avatar, email, });
      })
      .catch((err) => {
        if(err.code === 11000) {
          return next(new ConflictError('Такой email уже существует')); // 409
        }
        if(err.name === 'ValidationError') {
          return next(new BadRequestError('Ошибка валидации'));
        }
        return res.status(500).json({ message: err.message });
      })
  })
  .catch(next);
}

module.exports.updateUserInfo = async(req, res) => {
  const { name, about } = req.body;
  try {
    const userId = req.user._id; // проблема с этим
    console.log(userId);
    const user = await User.findByIdAndUpdate(userId,
      { name, about },
      { new: true, runValidators: true });
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).json(user);
  } catch (err) {
    if(err.name === 'ValidationError') {
      throw new BadRequestError('неправильные данные'); // 400
    }
    return res.status(500).json({ message: err.message });
  }
}

module.exports.updateAvatar = async(req, res) => {
  const { avatar } = req.body;
  try {
    const userId = req.user._id; 
    const newAvatar = await User.findByIdAndUpdate(userId,
      { avatar },
      { new: true, runValidators: true });
      if (!newAvatar) {
        return res.status(404).json({ message: 'Пользователь не найден c' });
      }
      return res.status(200).json(newAvatar);
  } catch (err) {
    if(err.name === 'ValidationError') {
      return res.status(400).json({ message: 'неправильные данные' });
    }
    return res.status(500).json({ message: err.message });
  }
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if(!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if(!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return res.status(200).send({
            message: 'Успешно авторизован',
            token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
          });
        }) 
    })
    .catch(() => {
      return next(new AuthError('ошибка'));
    })
    .catch(next);
}
