const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likedCard,
  deleteLike
} = require('../controllers/cards.js');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likedCard);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
