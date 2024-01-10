const mongoose = require('mongoose');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');
const bcrypt = require('bcrypt');

const regularAvatar = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

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
    validate: {
      validator: (u) => isURL(u) && regularAvatar,
      message: 'неправильная ссылка на аватар'
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: {value: true, message: 'Поле email должно быть заполнено'},
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректные данные'
    },
  },
  password: {
    type: String,
    required: {value: true, message: 'поле password должно быть заполнено'},
    minlength: 8,
    select: false,
  },
});

users.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if(!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if(!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        })
    })
}

module.exports = new mongoose.model('user', users);
