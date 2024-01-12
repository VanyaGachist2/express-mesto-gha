const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const users = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (u) => validator.isURL(u),
      message: "неправильная ссылка",
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (e) => validator.isEmail(e),
      message: 'неправильная почта',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

users.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if(!user) {
        return res.status(401).json({ message: 'Неправильные почта или пароль' }) // Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if(!matched) {
            return res.status(401).json({ message: 'Неправильные почта или пароль' });
          }

          return user;
        })
    })
}

module.exports = new mongoose.model('user', users);


// validate: {
//  validator: (u) => isURL(u),
//  message: 'неправильная ссылка на аватар'
// },
