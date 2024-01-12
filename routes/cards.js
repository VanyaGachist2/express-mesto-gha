const router = require('express').Router();
const { validationCard, validationCardId } = require('../middlewares/validation.js');

const {
  getCards,
  createCard,
  deleteCard,
  likedCard,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', validationCard, createCard);
router.delete('/cards/:cardId', validationCardId, deleteCard);
router.put('/cards/:cardId/likes', validationCardId, likedCard);
router.delete('/cards/:cardId/likes', validationCardId, deleteLike);

module.exports = router;
