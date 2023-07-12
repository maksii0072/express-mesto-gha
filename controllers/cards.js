const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const BadDataError = require('../error/BadDataError');

const cardDataUpdate = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .then((card) => {
      if (card) res.send({ data: card });
      else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена!'));
      }
      if (String(card.owner) !== owner) {
        next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return Card.findByIdAndRemove(cardId)
        .then((delCard) => res.status(200).send({ data: delCard }))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  cardDataUpdate(req, res, updateData, next);
};

module.exports.dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  cardDataUpdate(req, res, updateData, next);
};
