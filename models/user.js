const mongoose = require('mongoose');

const users = mongoose.Schema({
  name: {
    type: String,
    required: {value: true, message: 'name должен быть заполнен'},
    minlength: [2, 'минимальная длинна - 2'],
    maxlength: [30, 'максимальная длинна - 30'],
  },
  about: {
    type: String,
    required: {value: true, message: 'about должен быть заполнен'},
    minlength: [2, 'минимальная длина - 2'],
    maxlength: [30, 'максимальная длинна - 30'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некоректный url',
    },
    required: {value: true, message: 'avatar должен быть заполнен'},
  },
});

module.exports = new mongoose.model('user', users);
