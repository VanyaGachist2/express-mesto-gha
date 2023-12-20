const router = require('express').Router();
const { getUser, createUser, getUserById, updateUserInfo, updateAvatar } = require('../controllers/users.js');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
