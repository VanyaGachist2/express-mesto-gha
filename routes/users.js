const router = require('express').Router();
const { getUser, getUserById, updateUserInfo, updateAvatar } = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);


module.exports = router;
