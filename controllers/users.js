const User = require('../models/user');

module.exports.getUser = async(req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports.getUserById = async(req, res) => {
  try {
    const users = await User.findById(req.params.userId);
    if (!users) {
      return res.status(404).json({ message: 'Пользователь не найден'});
    }
    return res.json(users);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректный id'});
    }
    res.status(500).json({ message: err.message });
  }
}

module.exports.createUser = async(req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = new User({ name, about, avatar });
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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
    const userId = req.user._id; // проблема с этим
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
