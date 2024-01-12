const mongoose = require('mongoose');
const validator = require('validator');

const cards = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'минимальная длинна 2'],
    maxlength: [30, 'максимальная длинна 30'],
  },
  link: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некоректный url',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cards);
