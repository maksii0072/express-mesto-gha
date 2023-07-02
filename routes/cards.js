const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards); // возвращает всех пользователей

router.post('/cards', createCard); // возвращает пользователя по _id

router.delete('/cards/:cardId', deleteCard); // создаёт пользователя

router.put('/cards/:cardId/likes', likeCard); // поставить лайк карточке

router.delete('/cards/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
