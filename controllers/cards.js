const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const UserError = require('../errors/UserError'); // 403

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.createCard = async(req, res) => { // +
  const { name, link } = req.body;
  try {
    const card = new Card({ name, link, owner: req.user._id });
    const savedCard = await card.save();
    return res.status(201).json(savedCard);
  } catch (err) {
    if(err.name === 'ValidationError') {
      throw new BadRequestError('Некоррентные данные');
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteCard = async(req, res) => { // +
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточки нет');
    }
    if(card.owner.toString() !== req.user._id) {
       throw new UserError('это не ваша карточка, удаление невозможно');
    }
    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    if(err.name === 'CastError') {
      throw new BadRequestError('проблемма с _id');
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports.likedCard = async(req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
      );
      if (!card) {
        throw new NotFoundError('Карточки нет');
      }
      return res.status(200).json(card);
  } catch (err) {
    if(err.name === 'CastError') {
      throw new BadRequestError('Некоррентные данные');
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteLike = async (req, res) => { // +
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
      );
      if (!card) {
        throw new NotFoundError('Карточки нет');
      };
      return res.status(200).json(card);
  } catch (err) {
    if(err.name === 'CastError') {
      throw new BadRequestError('Некоррентные данные');
    }
    return res.status(500).json({ message: err.message });
  }
};
