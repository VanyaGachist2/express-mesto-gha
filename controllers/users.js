const User = require('../models/user');

const getUser = async(req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getUserById = async(req, res) => {
  try {
    const users = await User.findById(req.params.userId);
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const createUser = async(req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = new User({ name, about, avatar });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const updateUserInfo = async(req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.userId,
      {name, about, avatar},
      {new: true});
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.json(user);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
}

const updateAvatar = async(req, res) => {
  const { avatar } = req.body;
  try {
    const newAvatar = await User.findByIdAndUpdate(req.params.userId,
      {avatar},
      {new: true});
      if (!newAvatar) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.json(newAvatar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getUser,
  createUser,
  getUserById,
  updateUserInfo,
  updateAvatar,
}
