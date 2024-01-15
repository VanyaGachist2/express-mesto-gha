const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.getUser = async(req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports.getUserById = async(req, res) => {
  try {
    const users = await User.findById(req.params.userId);
    if (!users) {
      return res.status(404).json({ message: 'Пользователь не найден'});
    }
    return res.status(200).json(users);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректный id'});
    }
    return res.status(500).json({ message: err.message });
  }
}

module.exports.createUser = async(req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
      .then(() => {
        return res.status(201).json({ name, about, avatar, email, });
      })
      .catch((err) => {
        if(err.code === 11000) {
          return res.status(409).json({ message: 'Такой email уже существует' });
        }
        if(err.name === 'ValidationError') {
          return res.status(400).json({ message: 'Ошибка валидации' });
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
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.status(200).json(user);
  } catch (err) {
    if(err.name === 'ValidationError') {
      return res.status(400).json({ message: 'неправильные данные' });
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
        return res.status(401).json({ message: 'Неправильные почта или пароль' }) 
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if(!matched) {
            return res.status(401).json({ message: 'Неправильные почта или пароль' });
          }
          return res.status(200).send({
            message: 'Успешно авторизован',
            token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
          });
        }) 
    })
    .catch((err) => {
      return res.status(401).json({ message: err.message });
    })
    .catch(next);
}



// return User.findUserByCredentials(email, password)
// .then((user) => {
//    res.send({
//      token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
//    });
//  })
//  .catch((err) => {
//    res.status(401).json({ message: err.message });
//  })
//  .catch(next);
