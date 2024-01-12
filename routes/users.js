const router = require('express').Router();
const { getUser, getUserById, updateUserInfo, updateAvatar } = require('../controllers/users');
const { validationUserInfo, validationUserAvatar, validationUserId } = require('../middlewares/validation.js');

router.get('/users', getUser);
router.get('/users/:userId', validationUserId, getUserById);

router.patch('/users/me', validationUserInfo, updateUserInfo);
router.patch('/users/me/avatar', validationUserAvatar, updateAvatar);


module.exports = router;
