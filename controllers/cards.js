const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.createCard = async(req, res) => {
  const { name, link } = req.body;
  try {
    const card = new Card({ name, link, owner: req.user._id });
    const savedCard = await card.save();
    return res.status(201).json(savedCard);
  } catch (err) {
    if(err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Некоррентные данные'});
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteCard = async(req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Карточки нет' });
    }
    if(card.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'это не ваша карточка, удаление невозможно' });
    }
    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    if(err.name === 'CastError') {
      return res.status(400).json({ message: 'проблемма с _id'});
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
        return res.status(404).json({ message: 'Карточки нет' });
      }
      return res.status(200).json(card);
  } catch (err) {
    if(err.name === 'CastError') {
      return res.status(400).json({ message: 'Некоррентные данные'});
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
      );
      if (!card) {
        return res.status(404).json({ message: 'Карточки нет' });
      };
      return res.status(200).json(card);
  } catch (err) {
    if(err.name === 'CastError') {
      return res.status(400).json({ message: 'Некоррентные данные'});
    }
    return res.status(500).json({ message: err.message });
  }
};
